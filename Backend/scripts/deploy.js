import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Starting AyurChakra Herb Traceability Contract Deployment...\n");

  // Get the contract factory
  const AyurChakraContract = await ethers.getContractFactory("AyurChakraHerbTraceability");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const ayurChakraContract = await AyurChakraContract.deploy();
  await ayurChakraContract.waitForDeployment();

  console.log("✅ AyurChakra Herb Traceability Contract deployed to:", await ayurChakraContract.getAddress());
  console.log("📋 Contract Owner:", await ayurChakraContract.owner());
  console.log("📊 Total Batches:", (await ayurChakraContract.totalBatches()).toString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: await ayurChakraContract.getAddress(),
    owner: await ayurChakraContract.owner(),
    deploymentTime: new Date().toISOString(),
    network: await ethers.provider.getNetwork(),
    totalBatches: (await ayurChakraContract.totalBatches()).toString()
  };

  console.log("\n📄 Deployment Information:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await ayurChakraContract.owner();
  const totalBatches = await ayurChakraContract.totalBatches();
  
  if (owner && totalBatches.toString() === "0") {
    console.log("✅ Contract deployment verified successfully!");
  } else {
    console.log("❌ Contract deployment verification failed!");
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🌿 Your AyurChakra Herb Traceability Contract is ready for use!");
  
  return await ayurChakraContract.getAddress();
}

// Execute deployment
main()
  .then((address) => {
    console.log(`\n📍 Contract Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });