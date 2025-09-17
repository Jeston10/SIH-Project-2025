import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Starting AyurChakra Smart Contract Deployment...");

  // Get the contract factory
  const AyurChakra = await ethers.getContractFactory("AyurChakra");

  // Deploy the contract
  console.log("📝 Deploying contract...");
  const ayurChakra = await AyurChakra.deploy();

  // Wait for deployment to complete
  await ayurChakra.waitForDeployment();

  // Get the contract address
  const contractAddress = await ayurChakra.getAddress();

  console.log("✅ AyurChakra contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", hre.network.name);
  console.log("⛽ Gas Used:", (await ayurChakra.deploymentTransaction()).gasLimit.toString());

  // Verify contract info
  const contractInfo = await ayurChakra.getContractInfo();
  console.log("👤 Contract Owner:", contractInfo.contractOwner);
  console.log("📊 Block Number:", contractInfo.blockNumber.toString());
  console.log("⏰ Timestamp:", new Date(Number(contractInfo.timestamp) * 1000).toISOString());

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    blockNumber: contractInfo.blockNumber.toString(),
    timestamp: Number(contractInfo.timestamp).toString(),
    owner: contractInfo.contractOwner,
    deploymentDate: new Date().toISOString()
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🔧 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update your .env file with CONTRACT_ADDRESS=" + contractAddress);
  console.log("3. Verify the contract on Etherscan (optional)");
  console.log("4. Test the contract functions");

  return contractAddress;
}

// Execute deployment
main()
  .then((address) => {
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📍 Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
