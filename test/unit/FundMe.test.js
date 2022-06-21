const { assert } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "mockV3Aggregator",
            deployer);
    })

    describe("contructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });
});