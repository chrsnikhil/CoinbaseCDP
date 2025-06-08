const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const PLATFORM_WALLET = process.env.PLATFORM_WALLET;
  
  // Debug logs
  console.log("Environment variables loaded:");
  console.log("PLATFORM_WALLET:", PLATFORM_WALLET);
  console.log("PRIVATE_KEY exists:", !!process.env.PRIVATE_KEY);
  console.log("BASE_SEPOLIA_RPC_URL exists:", !!process.env.BASE_SEPOLIA_RPC_URL);

  if (!PLATFORM_WALLET) {
    throw new Error("Please set PLATFORM_WALLET in your .env file");
  }

  console.log("Deploying TaskManager with platform wallet:", PLATFORM_WALLET);
  
  const TaskManager = await hre.ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy(PLATFORM_WALLET);

  await taskManager.waitForDeployment();

  console.log("TaskManager deployed to:", await taskManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 