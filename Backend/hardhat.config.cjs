require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    amoy: {
      url: process.env.POLYGON_TESTNET_RPC_URL || "https://rpc.ankr.com/polygon_amoy/c32c45424c7d75b520a818d00f0468919811a42aeb127c5fc2cc768ee89dd376",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      gas: "auto"
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-mainnet.infura.io/v3/453dd8a8e3b745e887e6b338a32971eb",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      gas: "auto"
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "YOUR_ETHERSCAN_API_KEY"
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
