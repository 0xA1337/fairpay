import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseUnits } from "viem";

describe("Fairpay", function () {
  async function deployFairpayFixture() {
    const [owner, recipient, donor] = await hre.viem.getWalletClients();

    // Deploy mock USDC token
    const mockUSDC = await hre.viem.deployContract("MockUSDC", []);

    // Deploy Fairpay contract
    const fairpay = await hre.viem.deployContract("Fairpay", [mockUSDC.address]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      fairpay,
      mockUSDC,
      owner,
      recipient,
      donor,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right USDC token address", async function () {
      const { fairpay, mockUSDC } = await loadFixture(deployFairpayFixture);
      expect((await fairpay.read.usdcToken()).toLowerCase()).to.equal(mockUSDC.address);
    });
  });

  describe("Campaign Creation", function () {
    it("Should create a campaign with correct details", async function () {
      const { fairpay, recipient } = await loadFixture(deployFairpayFixture);
      const title = "Test Campaign";
      const description = "This is a test campaign";
      const bannerImage = "ipfs://QmTest";
      const goal = parseUnits("1000", 6); // 1000 USDC
      const endDate = BigInt((await time.latest()) + 30 * 24 * 60 * 60); // 30 days from now

      const tx = await fairpay.write.createCampaign([
        title,
        description,
        bannerImage,
        getAddress(recipient.account.address),
        goal,
        endDate,
      ]);

      const campaignCreatedEvents = await fairpay.getEvents.CampaignCreated();
      expect(campaignCreatedEvents).to.have.lengthOf(1);
      const event = campaignCreatedEvents[0];

      expect(event.args.title).to.equal(title);
      expect(event.args.recipient).to.equal(getAddress(recipient.account.address));
      expect(event.args.goal).to.equal(goal);
      expect(event.args.endDate).to.equal(endDate);

      const campaign = await fairpay.read.getCampaign([1n]);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.bannerImage).to.equal(bannerImage);
      expect(campaign.recipient).to.equal(getAddress(recipient.account.address));
      expect(campaign.goal).to.equal(goal);
      expect(campaign.endDate).to.equal(endDate);
      expect(campaign.totalRaised).to.equal(0n);
    });

    it("Should revert if recipient address is zero", async function () {
      const { fairpay } = await loadFixture(deployFairpayFixture);
      await expect(
        fairpay.write.createCampaign([
          "Test",
          "Test",
          "",
          "0x0000000000000000000000000000000000000000",
          0n,
          0n,
        ])
      ).to.be.rejectedWith("Invalid recipient address");
    });
  });

  describe("Donations", function () {
    it("Should allow donations and update campaign", async function () {
      const { fairpay, mockUSDC, recipient, donor } = await loadFixture(deployFairpayFixture);

      // Create a campaign
      await fairpay.write.createCampaign([
        "Test Campaign",
        "Description",
        "",
        getAddress(recipient.account.address),
        parseUnits("1000", 6),
        BigInt((await time.latest()) + 30 * 24 * 60 * 60),
      ]);

      // Approve USDC spend
      const donationAmount = parseUnits("100", 6); // 100 USDC
      await mockUSDC.write.mint([getAddress(donor.account.address), donationAmount]);
      await mockUSDC.write.approve([fairpay.address, donationAmount], { account: donor.account });

      // Donate
      await fairpay.write.donate([1n, donationAmount], { account: donor.account });

      // Check events
      const donationMadeEvents = await fairpay.getEvents.DonationMade();
      expect(donationMadeEvents).to.have.lengthOf(1);
      expect(donationMadeEvents[0].args.campaignId).to.equal(1n);
      expect(donationMadeEvents[0].args.donor).to.equal(getAddress(donor.account.address));
      expect(donationMadeEvents[0].args.amount).to.equal(donationAmount);

      // Check campaign update
      const campaign = await fairpay.read.getCampaign([1n]);
      expect(campaign.totalRaised).to.equal(donationAmount);

      // Check recipient balance
      const recipientBalance = await mockUSDC.read.balanceOf([
        getAddress(recipient.account.address),
      ]);
      expect(recipientBalance).to.equal(donationAmount);
    });

    it("Should revert if campaign doesn't exist", async function () {
      const { fairpay, donor } = await loadFixture(deployFairpayFixture);
      await expect(
        fairpay.write.donate([999n, 100n], { account: donor.account })
      ).to.be.rejectedWith("Campaign does not exist");
    });

    it("Should revert if donation amount is zero", async function () {
      const { fairpay, recipient, donor } = await loadFixture(deployFairpayFixture);
      await fairpay.write.createCampaign([
        "Test",
        "Test",
        "",
        getAddress(recipient.account.address),
        1000n,
        0n,
      ]);
      await expect(fairpay.write.donate([1n, 0n], { account: donor.account })).to.be.rejectedWith(
        "Donation amount must be greater than 0"
      );
    });

    it("Should revert if campaign has ended", async function () {
      const { fairpay, recipient, donor } = await loadFixture(deployFairpayFixture);
      const endDate = BigInt((await time.latest()) + 100);
      await fairpay.write.createCampaign([
        "Test",
        "Test",
        "",
        getAddress(recipient.account.address),
        1000n,
        endDate,
      ]);
      await time.increaseTo(endDate + 1n);
      await expect(fairpay.write.donate([1n, 100n], { account: donor.account })).to.be.rejectedWith(
        "Campaign has ended"
      );
    });
  });

  describe("Get Campaign", function () {
    it("Should return correct campaign details", async function () {
      const { fairpay, recipient } = await loadFixture(deployFairpayFixture);
      const title = "Test Campaign";
      const description = "This is a test campaign";
      const bannerImage = "ipfs://QmTest";
      const goal = parseUnits("1000", 6);
      const endDate = BigInt((await time.latest()) + 30 * 24 * 60 * 60);

      await fairpay.write.createCampaign([
        title,
        description,
        bannerImage,
        getAddress(recipient.account.address),
        goal,
        endDate,
      ]);

      const campaign = await fairpay.read.getCampaign([1n]);
      expect(campaign.id).to.equal(1n);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.bannerImage).to.equal(bannerImage);
      expect(campaign.recipient).to.equal(getAddress(recipient.account.address));
      expect(campaign.goal).to.equal(goal);
      expect(campaign.endDate).to.equal(endDate);
      expect(campaign.totalRaised).to.equal(0n);
    });

    it("Should revert for non-existent campaign", async function () {
      const { fairpay } = await loadFixture(deployFairpayFixture);
      await expect(fairpay.read.getCampaign([999n])).to.be.rejectedWith("Campaign does not exist");
    });
  });
});
