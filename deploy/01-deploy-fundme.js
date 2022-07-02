const { network } = require("hardhat");
const { networks } = require("../hardhat.config");
const { networkConfig, deploymentChains } = require("../helper.config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments;
   const { deployer } = await getNamedAccounts();
   const chainId = network.config.chainId;
   let priceFeedAddress;
   if (deploymentChains.includes(network.name)) {
      const ethToUsdAggrigator = await deployments.get("MockV3Aggregator");
      priceFeedAddress = ethToUsdAggrigator.address;
   } else {
      priceFeedAddress = networkConfig[chainId]["ethToUsdAddress"];
   }
   const fundme = await deploy("FundMe", {
      from: deployer,
      args: [priceFeedAddress],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
   });
   if (
      !deploymentChains.includes(network.name) &&
      process.env.ETHSCAN_API_KEY
   ) {
      await verify(fundme.address, [priceFeedAddress]);
   }
   log("deployed");
   log("-----------------------------------------");
};
module.exports.tags = ["all", "fundme"];
