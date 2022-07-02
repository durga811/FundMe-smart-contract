const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
   const { deployer } = await getNamedAccounts();
   const fundMe = await ethers.getContract("FundMe", deployer);
   console.log(`got contact at ${fundMe.address}`);
   console.log("funding to contract....");

   const fundingTransaction = await fundMe.fund({
      value: ethers.utils.parseEther(".05"),
   });
   await fundingTransaction.wait(1);
   console.log("funded");
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
