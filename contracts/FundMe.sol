//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_NotOwner();

/**
 *  @title A contract for crowd funding
 *  @author Johnsoncpk
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as ChainLink library
 */
contract FundMe{
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables 
    uint256 public constant MINIMUM_USD = 2;
    address[] public funders;
    address public immutable owner;
    mapping(address => uint256) public addressToAmountFunder;
    AggregatorV3Interface public priceFeed;

    modifier onlyOwner{
        //using customized error can reduce gas 
        if(msg.sender != owner){
            revert FundMe_NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress){
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
    *  @notice This contract is to demo a sample funding contract
    *  @dev This implements price feeds as ChainLink library
    */
    function fund() public payable{
        //set a minimum fund
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "Not enough value."); 
        funders.push(msg.sender);
        addressToAmountFunder[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner{
        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
}