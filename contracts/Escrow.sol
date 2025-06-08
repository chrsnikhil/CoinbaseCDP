// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Escrow {
    struct EscrowData {
        address payer;
        address payee;
        uint256 amount;
        bool released;
        bool refunded;
    }
    
    mapping(bytes32 => EscrowData) public escrows;
    uint256 public escrowCount;
    
    event EscrowCreated(bytes32 indexed escrowId, address payer, address payee, uint256 amount);
    event EscrowReleased(bytes32 indexed escrowId);
    event EscrowRefunded(bytes32 indexed escrowId);
    
    function createEscrow(address _payee) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        bytes32 escrowId = keccak256(abi.encodePacked(block.timestamp, msg.sender, _payee, msg.value));
        
        escrows[escrowId] = EscrowData({
            payer: msg.sender,
            payee: _payee,
            amount: msg.value,
            released: false,
            refunded: false
        });
        
        escrowCount++;
        emit EscrowCreated(escrowId, msg.sender, _payee, msg.value);
    }

    function getEscrowCount() external view returns (uint256) {
        return escrowCount;
    }
} 