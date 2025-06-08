// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskManager is ReentrancyGuard, Ownable {
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    
    struct Task {
        uint256 id;
        address poster;
        address doer;
        uint256 amount;
        string description;
        bool isCompleted;
        bool isPaid;
        uint256 createdAt;
        string submissionUrl;
    }
    
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    
    // Platform wallet address
    address public platformWallet;
    
    event TaskCreated(uint256 indexed taskId, address indexed poster, uint256 amount);
    event TaskAssigned(uint256 indexed taskId, address indexed doer);
    event TaskCompleted(uint256 indexed taskId, string submissionUrl);
    event PaymentReleased(uint256 indexed taskId, address indexed doer, uint256 amount);
    event PlatformFeeCollected(uint256 indexed taskId, uint256 amount);
    
    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    function createTask(string memory _description) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        taskCount++;
        tasks[taskCount] = Task({
            id: taskCount,
            poster: msg.sender,
            doer: address(0),
            amount: msg.value,
            description: _description,
            isCompleted: false,
            isPaid: false,
            createdAt: block.timestamp,
            submissionUrl: ""
        });
        
        emit TaskCreated(taskCount, msg.sender, msg.value);
    }
    
    function assignTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.poster != address(0), "Task does not exist");
        require(task.doer == address(0), "Task already assigned");
        require(msg.sender != task.poster, "Cannot assign to yourself");
        
        task.doer = msg.sender;
        emit TaskAssigned(_taskId, msg.sender);
    }
    
    function completeTask(uint256 _taskId, string memory _submissionUrl) external {
        Task storage task = tasks[_taskId];
        require(task.doer == msg.sender, "Only assigned doer can complete");
        require(!task.isCompleted, "Task already completed");
        
        task.isCompleted = true;
        task.submissionUrl = _submissionUrl;
        emit TaskCompleted(_taskId, _submissionUrl);
    }
    
    function releasePayment(uint256 _taskId) external nonReentrant {
        Task storage task = tasks[_taskId];
        require(task.poster == msg.sender, "Only poster can release payment");
        require(task.isCompleted, "Task not completed");
        require(!task.isPaid, "Payment already released");
        
        task.isPaid = true;
        
        // Calculate platform fee
        uint256 platformFeeAmount = (task.amount * platformFee) / 10000;
        uint256 doerAmount = task.amount - platformFeeAmount;
        
        // Transfer platform fee
        (bool sentFee, ) = platformWallet.call{value: platformFeeAmount}("");
        require(sentFee, "Platform fee transfer failed");
        
        // Transfer payment to doer
        (bool sentDoer, ) = task.doer.call{value: doerAmount}("");
        require(sentDoer, "Payment transfer failed");
        
        emit PlatformFeeCollected(_taskId, platformFeeAmount);
        emit PaymentReleased(_taskId, task.doer, doerAmount);
    }
    
    // Function to update platform fee (only owner)
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = _newFee;
    }
    
    // Function to update platform wallet (only owner)
    function setPlatformWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid wallet address");
        platformWallet = _newWallet;
    }
    
    function getTask(uint256 _taskId) external view returns (
        uint256 id,
        address poster,
        address doer,
        uint256 amount,
        string memory description,
        bool isCompleted,
        bool isPaid,
        uint256 createdAt,
        string memory submissionUrl
    ) {
        Task storage task = tasks[_taskId];
        return (
            task.id,
            task.poster,
            task.doer,
            task.amount,
            task.description,
            task.isCompleted,
            task.isPaid,
            task.createdAt,
            task.submissionUrl
        );
    }
    
    // Function to get contract's ETH balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 