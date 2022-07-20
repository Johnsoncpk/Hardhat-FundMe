//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe_NotiOwner();

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
    address[] public sFunders;
    address public immutable iOwner;
    mapping(address => uint256) public sAddressToAmountFunder;
    AggregatorV3Interface public sPriceFeed;

    modifier onlyiOwner{
        //using customized error can reduce gas 
        if(msg.sender != iOwner){
            revert FundMe_NotiOwner();
        }
        _;
    }

    constructor(address sPriceFeedAddress){
        iOwner = msg.sender;
        sPriceFeed = AggregatorV3Interface(sPriceFeedAddress);
    }

    /**
    *  @notice This contract is to demo a sample funding contract
    *  @dev This implements price feeds as ChainLink library
    */
    function fund() public payable{
        //set a minimum fund
        require(msg.value.getConversionRate(sPriceFeed) >= MINIMUM_USD, "Not enough value."); 
        sFunders.push(msg.sender);
        sAddressToAmountFunder[msg.sender] = msg.value;
    }

    function withdraw() public payable onlyiOwner{
        sFunders = new address[](0);
        (bool callSuccess, ) = msg.sender.call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    
}