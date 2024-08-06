// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Fairpay {
    IERC20 public immutable usdcToken;
    uint256 private currentCampaignId;

    struct Campaign {
        uint256 id;
        string title;
        string description;
        string bannerImage;
        address recipient;
        uint256 goal;
        uint256 endDate;
        uint256 totalRaised;
    }

    mapping(uint256 => Campaign) public campaigns;

    event CampaignCreated(
        uint256 indexed id,
        string title,
        address indexed recipient,
        uint256 goal,
        uint256 endDate
    );

    event DonationMade(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount
    );

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _bannerImage,
        address _recipient,
        uint256 _goal,
        uint256 _endDate
    ) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient address");
        
        currentCampaignId += 1;
        campaigns[currentCampaignId] = Campaign({
            id: currentCampaignId,
            title: _title,
            description: _description,
            bannerImage: _bannerImage,
            recipient: _recipient,
            goal: _goal,
            endDate: _endDate,
            totalRaised: 0
        });

        emit CampaignCreated(currentCampaignId, _title, _recipient, _goal, _endDate);

        return currentCampaignId;
    }

    function donate(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.recipient != address(0), "Campaign does not exist");
        require(_amount > 0, "Donation amount must be greater than 0");
        
        if (campaign.endDate != 0) {
            require(block.timestamp <= campaign.endDate, "Campaign has ended");
        }

        require(usdcToken.transferFrom(msg.sender, campaign.recipient, _amount), "USDC transfer failed");

        campaign.totalRaised += _amount;

        emit DonationMade(_campaignId, msg.sender, _amount);
    }

    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.recipient != address(0), "Campaign does not exist");
        return campaign;
    }
}