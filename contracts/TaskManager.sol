// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is ReentrancyGuard, Ownable {
    struct Task {
        address poster;
        address doer;
        string description;
        uint256 paymentAmount;
        uint256 commitmentFee;
        bool isActive;
        bool isCompleted;
        bool isApproved;
        uint256 createdAt;
        uint256 completedAt;
    }

    // Mapping of task ID to Task
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    
    // Commitment fee percentage (e.g., 5% = 500)
    uint256 public commitmentFeePercentage = 500; // 5%
    
    // Events
    event TaskCreated(uint256 indexed taskId, address indexed poster, uint256 paymentAmount);
    event TaskAssigned(uint256 indexed taskId, address indexed doer);
    event TaskCompleted(uint256 indexed taskId);
    event TaskApproved(uint256 indexed taskId);
    event TaskRejected(uint256 indexed taskId);
    event CommitmentFeePaid(uint256 indexed taskId, address indexed doer, uint256 amount);
    event CommitmentFeeRefunded(uint256 indexed taskId, address indexed doer, uint256 amount);
    event PaymentReleased(uint256 indexed taskId, address indexed doer, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // Create a new task
    function createTask(string memory _description, uint256 _paymentAmount) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value == _paymentAmount, "Incorrect payment amount");
        require(_paymentAmount > 0, "Payment amount must be greater than 0");

        taskCount++;
        tasks[taskCount] = Task({
            poster: msg.sender,
            doer: address(0),
            description: _description,
            paymentAmount: _paymentAmount,
            commitmentFee: (_paymentAmount * commitmentFeePercentage) / 10000,
            isActive: true,
            isCompleted: false,
            isApproved: false,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit TaskCreated(taskCount, msg.sender, _paymentAmount);
    }

    // Apply for a task (pay commitment fee)
    function applyForTask(uint256 _taskId) 
        external 
        payable 
        nonReentrant 
    {
        Task storage task = tasks[_taskId];
        require(task.isActive, "Task is not active");
        require(task.doer == address(0), "Task already assigned");
        require(msg.value == task.commitmentFee, "Incorrect commitment fee");

        task.doer = msg.sender;
        emit TaskAssigned(_taskId, msg.sender);
        emit CommitmentFeePaid(_taskId, msg.sender, task.commitmentFee);
    }

    // Mark task as completed
    function completeTask(uint256 _taskId) 
        external 
        nonReentrant 
    {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.doer, "Only assigned doer can complete task");
        require(task.isActive, "Task is not active");
        require(!task.isCompleted, "Task already completed");

        task.isCompleted = true;
        task.completedAt = block.timestamp;
        emit TaskCompleted(_taskId);
    }

    // Approve task and release payment
    function approveTask(uint256 _taskId) 
        external 
        nonReentrant 
    {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.poster, "Only poster can approve task");
        require(task.isCompleted, "Task not completed");
        require(!task.isApproved, "Task already approved");

        task.isApproved = true;
        task.isActive = false;

        // Refund commitment fee
        (bool success1, ) = task.doer.call{value: task.commitmentFee}("");
        require(success1, "Commitment fee refund failed");
        emit CommitmentFeeRefunded(_taskId, task.doer, task.commitmentFee);

        // Release payment
        (bool success2, ) = task.doer.call{value: task.paymentAmount}("");
        require(success2, "Payment release failed");
        emit PaymentReleased(_taskId, task.doer, task.paymentAmount);
    }

    // Reject task and refund commitment fee
    function rejectTask(uint256 _taskId) 
        external 
        nonReentrant 
    {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.poster, "Only poster can reject task");
        require(task.isCompleted, "Task not completed");
        require(!task.isApproved, "Task already approved");

        task.isActive = false;
        task.isCompleted = false;

        // Refund commitment fee
        (bool success, ) = task.doer.call{value: task.commitmentFee}("");
        require(success, "Commitment fee refund failed");
        emit CommitmentFeeRefunded(_taskId, task.doer, task.commitmentFee);
        emit TaskRejected(_taskId);
    }

    // Get task details
    function getTask(uint256 _taskId) 
        external 
        view 
        returns (
            address poster,
            address doer,
            string memory description,
            uint256 paymentAmount,
            uint256 commitmentFee,
            bool isActive,
            bool isCompleted,
            bool isApproved,
            uint256 createdAt,
            uint256 completedAt
        ) 
    {
        Task storage task = tasks[_taskId];
        return (
            task.poster,
            task.doer,
            task.description,
            task.paymentAmount,
            task.commitmentFee,
            task.isActive,
            task.isCompleted,
            task.isApproved,
            task.createdAt,
            task.completedAt
        );
    }

    // Update commitment fee percentage (only owner)
    function updateCommitmentFeePercentage(uint256 _newPercentage) 
        external 
        onlyOwner 
    {
        require(_newPercentage <= 1000, "Percentage cannot exceed 10%");
        commitmentFeePercentage = _newPercentage;
    }

    // Emergency withdrawal (only owner)
    function emergencyWithdraw() 
        external 
        onlyOwner 
    {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
} 