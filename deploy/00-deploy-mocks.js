const { network } = require("hardhat");
const { networks } = require("../hardhat.config");
const {
   networkConfig,
   deploymentChains,
   decimal,
   initalAnswer,
} = require("../helper.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments;
   const { deployer } = await getNamedAccounts();
   const chainId = network.config.chainId;

   if (chainId == 31337) {
      log("local network found");
      await deploy("MockV3Aggregator", {
         contract: "MockV3Aggregator",
         from: deployer,
         log: true,
         args: [decimal, initalAnswer],
      });
      log("deployed");
      log("-------------------");
   }
};
module.exports.tags = ["all", "mock"];
