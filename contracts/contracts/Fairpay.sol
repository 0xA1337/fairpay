// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Fairpay is Ownable {
    IERC20 public immutable usdcToken;
    uint256 private currentCampaignId;
    address public feeCollector;

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
        string bannerImage,
        uint256 goal,
        uint256 endDate
    );

    event DonationMade(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 fee
    );

    event FeeCollectorUpdated(address indexed newFeeCollector);

    constructor(address _usdcToken, address _feeCollector) Ownable(msg.sender) {
        usdcToken = IERC20(_usdcToken);
        feeCollector = _feeCollector;
    }

    function setFeeCollector(address _newFeeCollector) external onlyOwner {
        require(_newFeeCollector != address(0), "Invalid fee collector address");
        feeCollector = _newFeeCollector;
        emit FeeCollectorUpdated(_newFeeCollector);
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
        
        currentCampaignId++;
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

        emit CampaignCreated(currentCampaignId, _title, _recipient, _bannerImage, _goal, _endDate);

        return currentCampaignId;
    }

    function donate(uint256 _campaignId, uint256 _amount) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.recipient != address(0), "Campaign does not exist");
        require(_amount > 0, "Donation amount must be greater than 0");
        
        if (campaign.endDate != 0) {
            require(block.timestamp <= campaign.endDate, "Campaign has ended");
        }

        uint256 fee = calculateFee(_amount);
        uint256 amountAfterFee = _amount - fee;

        require(usdcToken.transferFrom(msg.sender, campaign.recipient, amountAfterFee), "USDC transfer to recipient failed");
        
        if (fee > 0) {
            require(usdcToken.transferFrom(msg.sender, feeCollector, fee), "USDC fee transfer failed");
        }

        campaign.totalRaised += amountAfterFee;

        emit DonationMade(_campaignId, msg.sender, _amount, fee);
    }

    function calculateFee(uint256 _amount) public pure returns (uint256) {
        if (_amount < 100e6) {
            return 0;
        } else if (_amount <= 10_000e6) {
            return (_amount * 5) / 100;
        } else {
            return (_amount * 15) / 1000;
        }
    }

    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        Campaign memory campaign = campaigns[_campaignId];
        require(campaign.recipient != address(0), "Campaign does not exist");
        return campaign;
    }
}