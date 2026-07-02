// PaymentContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PaymentContract {
    address public businessUser;
    uint256 public paymentAmount;
    bool public isPaid;

    event PaymentReceived(address indexed from, uint256 amount);

    constructor(uint256 _paymentAmount) {
        businessUser = msg.sender;
        paymentAmount = _paymentAmount;
        isPaid = false;
    }

    function pay() public payable {
        require(!isPaid, "Payment already made");
        require(msg.value == paymentAmount, "Invalid payment amount");
        payable(businessUser).transfer(msg.value);
        isPaid = true;
        emit PaymentReceived(msg.sender, msg.value);
    }
}