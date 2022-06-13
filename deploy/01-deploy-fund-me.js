// import
// main function
// calling of main function

const { networks } = require("../hardhat.config");

// function deployFunction(hre) {
//     console.log("hi");
// };

// module.exports.default = deployFunction;

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = networks.config.chainId;
}