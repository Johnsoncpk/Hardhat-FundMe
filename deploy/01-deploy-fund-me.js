// import
// main function
// calling of main function

const { network } = require("hardhat");

const { verify } = require("../utils/verify");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPirceFeedAddress;

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPirceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPirceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    const args = [
        ethUsdPirceFeedAddress
    ];

    //use mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 5,
    })
    if (!developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
    log("----------------");
}

module.exports.tags = ["all", "fundme"];