import { config as dotenvConfig } from "dotenv";
import { join, resolve } from "path";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { NetworkUserConfig } from "hardhat/types";
import { readdirSync } from "fs";

dotenvConfig({ path: resolve(__dirname, "./.env") });

// init typechain for the first time
try {
  readdirSync(join(__dirname, "typechain"));
  require("./tasks");
} catch {
  //
}

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  polygon: 137,
  bsctestnet: 97,
  bsc: 56,
  eth: 1,
};

const deployerPrivateKey: string | undefined = process.env.DEPLOYER_PRIVATE_KEY;
if (!deployerPrivateKey) {
  throw new Error("Please set your DEPLOYER_PRIVATE_KEY in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let url: string = "https://" + network + ".infura.io/v3/" + infuraApiKey;
  if (network === "polygon") {
    url = "https://polygon-rpc.com";
  }

  if (network === "bsctestnet") {
    url = "https://data-seed-prebsc-1-s1.binance.org:8545/";
  }

  if (network === "bsc") {
    url = "https://bsc-dataseed.binance.org/";
  }

  // if (network === 'eth') {
  //   url = 'https://mainnet.infura.io/v3/' + infuraApiKey;
  // }

  return {
    accounts: [`0x${deployerPrivateKey}`],
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  solidity: "0.8.2",
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: !!process.env.REPORT_GAS,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
      // accounts: [{
      //   privateKey: process.env.DEPLOYER_PRIVATE_KEY || "",
      //   balance: "1000000000000000000000000"
      // }]
    },
    bsctestnet: getChainConfig("bsctestnet"),
    ropsten: getChainConfig("ropsten"),
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
