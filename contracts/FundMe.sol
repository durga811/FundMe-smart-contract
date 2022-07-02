// SPDX-License-Identifier: MIT
//1.pragma
pragma solidity ^0.8.8;
//2.imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
//3.error
error FundMe_NotOwner();
 
//interfaces,libraries,contracts
///@title it is crowd funding contract
///@author durga prasad
///@notice it is simple funding contract
///@dev i used chainlink for pricefeed

contract FundMe {
    //a. type declaration
    using PriceConverter for uint256;

   //b.state varible declaration
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;
    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address public /* immutable */ i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10 ** 18;
    AggregatorV3Interface public priceFeed;

  //c.modifiers
    modifier onlyOwner {
        // require(msg.sender == owner);
           if (msg.sender != i_owner) revert FundMe_NotOwner();
          _;
    }

    //d.functions
    constructor(address pricefeedAddres) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(pricefeedAddres);
    }


    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
    function fund() public payable {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }
    
   
    
    function withdraw() payable onlyOwner public {
        for (uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }
    // Explainer from: https://solidity-by-example.org/fallback/
    // Ether is sent to contract
    //      is msg.data empty?
    //          /   \ 
    //         yes  no
    //         /     \
    //    receive()?  fallback() 
    //     /   \ 
    //   yes   no
    //  /        \
    //receive()  fallback()

    

}

// Concepts we didn't cover yet (will cover in later sections)
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly