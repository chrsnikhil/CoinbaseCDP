import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const TaskManager = await ethers.getContractFactory("TaskManager");

  // USDC contract address on Base Sepolia
  const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7c"; // Base Sepolia USDC
  
  // Platform wallet address (replace with your platform wallet)
  const PLATFORM_WALLET = "YOUR_PLATFORM_WALLET_ADDRESS";

  console.log("Deploying TaskManager...");
  
  // Deploy the contract
  const taskManager = await TaskManager.deploy(USDC_ADDRESS, PLATFORM_WALLET);
  
  // Wait for deployment to finish
  await taskManager.waitForDeployment();

  const address = await taskManager.getAddress();
  console.log(`TaskManager deployed to: ${address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 