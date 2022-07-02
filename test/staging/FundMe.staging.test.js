const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { deploymentChains } = require("../../helper.config");

deploymentChains.includes(network.name)
   ? describe.skip
   : describe("fund me staging test", () => {
        let fundMe;
        let deployer;
        const sendEth = ethers.utils.parseEther(".05");
        beforeEach(async () => {
           deployer = (await getNamedAccounts()).deployer;
           fundMe = await ethers.getContract("FundMe", deployer);
        });

        it("test fund withdraw is working  or not", async () => {
           await fundMe.fund({ value: sendEth });

           const transactionResponse = await fundMe.withdraw();
           await transactionResponse.wait(1);
           const endingFundMeBalance = await fundMe.provider.getBalance(
              fundMe.address
           );
           console.log(endingFundMeBalance.toString()) + "should be 0.";
           assert.equal(endingFundMeBalance.toString(), "0");
        });
     });
