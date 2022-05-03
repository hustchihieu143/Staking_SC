import { expect } from "chai";
import { ethers } from "hardhat";
import { Wallet, Signer, utils, BigNumber } from "ethers";
import * as USDT from "../artifacts/contracts/mocks/MockUSDT.sol/MockUSDT.json";
import * as StakingPoolABI from "../artifacts/contracts/StakingPool.sol/StakingPool.json";
import web3 from "web3";

describe("StakingPool Contract", () => {
  let USDTContract,
    usdt: any,
    StakingPool,
    stakingPool: any,
    owner: any,
    addr1: any,
    addr2: any;
  beforeEach(async () => {
    const wallets: any = await ethers.getSigners();

    owner = wallets[0];
    addr1 = wallets[1];
    addr2 = wallets[2];

    // deploy usdt token
    USDTContract = await ethers.getContractFactory("MockUSDT");
    usdt = await USDTContract.deploy();

    // deploy staking-pool
    StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy();

    // mint token
    usdt.mint(addr1.address, 10000);

    // approve token
    usdt.connect(addr1).approve(stakingPool.address, 10000);

    const balanceOfAddr1 = await usdt.balanceOf(addr1.address);
    console.log("balanceOfAddr1: ", balanceOfAddr1);

    await stakingPool.__StakingPool_init();
  });

  describe("test function create pool", () => {
    it("create pool successfully", async () => {
      await stakingPool
        .connect(owner)
        .createPool(usdt.address, 1000, 30, 0, 600);
      const contract = new ethers.Contract(
        stakingPool.address,
        StakingPoolABI.abi,
        ethers.provider
      );
      const listPool = await contract.poolInfo(0);
      expect(listPool.length).to.equal(6);
    });
  });

  describe("test deposit function", () => {
    it("deposit success", async () => {
      await stakingPool
        .connect(owner)
        .createPool(usdt.address, 1000, 30, 0, 600);

      const contract = new ethers.Contract(
        stakingPool.address,
        StakingPoolABI.abi,
        ethers.provider
      );

      const res = await stakingPool.connect(addr1).deposit(0, 100);

      const eventFilter2 = contract.filters.StakingPoolDeposit();

      const events2 = await contract.queryFilter(
        eventFilter2,
        res.blockNumber,
        res.blockNumber
      );

      expect(events2[0].args?.amount).to.equal(100);
    });
  });

  describe("test withdraw function", () => {
    it("withdraw success", async () => {
      await stakingPool
        .connect(owner)
        .createPool(usdt.address, 1000, 30, 0, 600);
      await stakingPool.connect(addr1).deposit(0, 100);
      await stakingPool.connect(addr1).deposit(0, 200);
      console.log("total: ", await stakingPool.totalStakedOfPool(0));
      await stakingPool.connect(addr1).withdraw(0, 100, 0);
      console.log("total: ", await stakingPool.totalStakedOfPool(0));
      expect(await stakingPool.totalStakedOfPool(0)).to.equal(200);
    });
  });
});
