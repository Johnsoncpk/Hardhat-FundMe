// import
// main function
// calling of main function

const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPirceFeedAddress;

    if (developmentChains.includes(network.name)) {
        let ethUsdAggregator;
        try {
            ethUsdAggregator = await deployments.get("MockV3Aggregator");
        } catch (e) {
            ethUsdAggregator = await deploy("MockV3Aggregator", {
                contract: "MockV3Aggregator",
                from: deployer,
                log: true,
                args: [
                    DECIMALS,
                    INITIAL_ANSWER,
                ],
            });
        }
        ethUsdPirceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPirceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")

    const args = [
        ethUsdPirceFeedAddress
    ];

    //use mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)
    if (!developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
    log("----------------");
}

module.exports.tags = ["all", "fundme"];