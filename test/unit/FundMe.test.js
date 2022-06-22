const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    let sendValue = ethers.utils.parseEther(1);
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer);
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        });
    });

    describe("fund", async function () {
        it("rejected if not enough fund", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "Not enough value."
            );
        });
        // it("updated the amount funded", async function () {
        //     await fundMe.fund({ value: sendValue });
        //     const response = await fundMe.addressToAmountFunder(deployer);
        //     assert(response.toString(), sendValue.toString());
        // });
    });
});