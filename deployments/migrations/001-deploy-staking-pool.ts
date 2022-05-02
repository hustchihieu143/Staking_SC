import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("deployer: ", deployer);

  // const StableFinancePoolFactory = await ethers.getContractFactory("StableFinancePool");
  // const stableFinancePool = await StableFinancePoolFactory.deploy();
  // await stableFinancePool.deployed();

  // console.log(`Deployed success at address ${stableFinancePool.address}`);
  // console.log(`Start init`);

  // await stableFinancePool.__StableFinancePool_init();
  // console.log('Done');
  await deploy("StakingPool", {
    from: deployer,
    log: true,
    args: [],
    proxy: {
      proxyContract: "OptimizedTransparentProxy",
      owner: deployer,
      execute: {
        methodName: "__StakingPool_init",
        // args: ["0xf42857DA0Bf94d8C57Bc9aE62cfAAE3722ed9DAb"],
      },
    },
  });
};

func.tags = ["StakingPool"];
export default func;
