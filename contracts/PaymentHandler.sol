// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Escrow.sol";

contract PaymentHandler {
    Escrow public escrow;
    
    constructor(address _escrowAddress) {
        escrow = Escrow(_escrowAddress);
    }
    
    function handlePayment(address _payee) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        escrow.createEscrow{value: msg.value}(_payee);
    }
} 