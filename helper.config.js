const networkConfig = {
   4: {
      name: "rinkeby",
      ethToUsdAddress: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
   },
   137: {
      name: "polygon",
      ethToUsdAddress: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
   },
};
const deploymentChains = ["hardhat", "localhost"];
const decimal = 8;
const initalAnswer = 200000000000;

module.exports = {
   networkConfig,
   deploymentChains,
   decimal,
   initalAnswer,
};
