const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { deploymentChains } = require("../../helper.config");
!deploymentChains.includes(network.name)
   ? describe.skip
   : describe("Fundme", function () {
        let fundMe;
        let MockV3Aggregator;
        let sendValue = ethers.utils.parseEther("1"); //1eth
        let deployer;
        beforeEach("fundme", async function () {
           deployer = (await getNamedAccounts()).deployer;
           await deployments.fixture(["all"]);
           fundMe = await ethers.getContract("FundMe", deployer);
           MockV3Aggregator = await ethers.getContract(
              "MockV3Aggregator",
              deployer
           );
        });

        describe("constructor", function () {
           it("is priceFeed correctly come from aggregator ", async function () {
              const response = await fundMe.priceFeed();
              assert.equal(response, MockV3Aggregator.address);
           });
        });

        describe("fund", function () {
           it("for checking minUsd works or not", async function () {
              await expect(fundMe.fund()).to.be.reverted;
           });
           it("sending 1eth for update the value of sender", async () => {
              await fundMe.fund({ value: sendValue });
              const response = await fundMe.addressToAmountFunded(deployer);
              assert.equal(response.toString(), sendValue.toString());
           });
           it("add funder to array", async () => {
              await fundMe.fund({ value: sendValue });
              const funder = await fundMe.funders(0);
              assert.equal(deployer, funder);
           });
        });

        describe("withdraw", () => {
           beforeEach("store some eth to contract", async () => {
              await fundMe.fund({ value: sendValue });
           });
           it("withdraw from contract", async () => {
              const startingValueOfContract = await fundMe.provider.getBalance(
                 fundMe.address
              );
              const startingValueOfDeployer = await fundMe.provider.getBalance(
                 deployer
              );
              const transactionResponse = await fundMe.withdraw();
              const transactionReceipt = await transactionResponse.wait(1);

              const { gasUsed, effectiveGasPrice } = transactionReceipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);

              const endingValueOfContract = await fundMe.provider.getBalance(
                 fundMe.address
              );
              const endingValueOfDeployer = await fundMe.provider.getBalance(
                 deployer
              );
              //check
              assert.equal(endingValueOfContract, 0);
              assert.equal(
                 startingValueOfContract
                    .add(startingValueOfDeployer)
                    .toString(),
                 endingValueOfDeployer.add(gasCost).toString()
              );
           });
           it("withdraw from multiple senders", async () => {
              const accounts = await ethers.getSigners();
              for (let i = 1; i < 6; i++) {
                 const connectedAccount = await fundMe.connect(accounts[i]);
                 await connectedAccount.fund({ value: sendValue });
              }
              //for withdraw check
              const startingValueOfContract = await fundMe.provider.getBalance(
                 fundMe.address
              );
              const startingValueOfDeployer = await fundMe.provider.getBalance(
                 deployer
              );
              const transactionResponse = await fundMe.withdraw();
              const transactionReceipt = await transactionResponse.wait(1);

              const { gasUsed, effectiveGasPrice } = transactionReceipt;
              const gasCost = gasUsed.mul(effectiveGasPrice);

              const endingValueOfContract = await fundMe.provider.getBalance(
                 fundMe.address
              );
              const endingValueOfDeployer = await fundMe.provider.getBalance(
                 deployer
              );
              assert.equal(endingValueOfContract, 0);
              assert.equal(
                 startingValueOfContract
                    .add(startingValueOfDeployer)
                    .toString(),
                 endingValueOfDeployer.add(gasCost).toString()
              );
              //for fonder fund =0
              for (let index = 1; index < 6; index++) {
                 assert.equal(
                    await fundMe.addressToAmountFunded(accounts[index].address),
                    0
                 );
              }
              //for empty array
              await expect(fundMe.funders(0)).to.be.reverted;
           });
           it("only owner can withdraw", async () => {
              const accounts = await ethers.getSigners();
              const attacker = accounts[1];
              const connectAttacker = await fundMe.connect(attacker);
              await expect(connectAttacker.withdraw()).to.be.revertedWith(
                 "FundMe_NotOwner"
              );
           });
        });
     });
