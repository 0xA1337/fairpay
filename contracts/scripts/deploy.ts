import hre from "hardhat";

async function main() {
  const network = hre.network.name;
  const [deployer] = await hre.viem.getWalletClients();
  const deployerAddress = deployer.account.address;

  console.log(`Deploying contracts with the account: ${deployerAddress}`);

  if (network === "base-sepolia") {
    const mUsdc = await hre.viem.deployContract("MockUSDC", []);
    console.log(`Deployed MockUSDC at ${mUsdc.address} on ${network}`);
    const fairpay = await hre.viem.deployContract("Fairpay", [mUsdc.address, deployerAddress]);
    console.log(`Deployed Fairpay at ${fairpay.address} on ${network}`);
    return;
  }

  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const fairpay = await hre.viem.deployContract("Fairpay", [usdcAddress, deployerAddress]);
  console.log(`Deployed Fairpay at ${fairpay.address} on ${network}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
