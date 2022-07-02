const { version } = require("chai");

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHSCAN_API_KEY = process.env.ETHSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
module.exports = {
   solidity: {
      compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
   },
   networks: {
      rinkeby: {
         url: RINKEBY_RPC_URL,
         accounts: [PRIVATE_KEY],
         chainId: 4,
         blockConfirmations: 2,
      },
   },
   gasReporter: {
      enabled: true,
      currency: "USD",
      noColors: true,
      coinmarketcap: COINMARKETCAP_API_KEY,
      outputFile: "gas-report.txt",
      token: "MATIC",
   },
   etherscan: {
      apiKey: ETHSCAN_API_KEY,
   },
   namedAccounts: {
      deployer: {
         default: 0, // here this will by default take the first account as deployer
      },
   },
};
