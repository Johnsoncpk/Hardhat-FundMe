// Get funds from users
// Withdraw Funds
// Set a minium funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

error NotOwner();

contract FundMe{

    using PriceConverter for uint256;

    // current gas 885,394
    // constant/immutable to reduce gas
    // 885129 -> 859146
    // immutable 859146 -> 832016
    uint256 public constant MINIMUM_USD = 2;
    address[] public funders;
    address public immutable owner;
    mapping(address => uint256) public addressToAmountFunder;
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress){
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable{
        //set a minimum fund
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Not enough value."); 
        funders.push(msg.sender);
        addressToAmountFunder[msg.sender] = msg.value;
    }

    receive() external payable{
        fund();
    }

    fallback() external payable{
        fund();
    }

    function withdraw() public onlyOwner{
        funders = new address[](0);
        // reset array
        // transfer, send, call
        // payable(msg.sender) = payable address
        // payable(msg.sender).transfer(address(this).balance);

        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        //call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner{
        //using customized error can reduce gas 
        if(msg.sender != owner){
            revert NotOwner();
        }
        _;
    }
}