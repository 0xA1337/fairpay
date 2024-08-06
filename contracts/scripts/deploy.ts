import hre from "hardhat";

async function main() {
  const sepoliaUsdc = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
  const mainnetUsdc = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const usdc = hre.network.name === "base-sepolia" ? sepoliaUsdc : mainnetUsdc;

  const fairpay = await hre.viem.deployContract("Fairpay", [usdc]);

  console.log(
    `Deploy Fairpay to ${hre.network.name} with address: ${fairpay.address}, using USDC: ${usdc}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
