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
    rewardDistributor: any;
  beforeEach(async () => {
    const wallets: any = await ethers.getSigners();

    owner = wallets[0];
    addr1 = wallets[1];
    rewardDistributor = wallets[2];
    // deploy usdt token
    USDTContract = await ethers.getContractFactory("MockUSDT");
    usdt = await USDTContract.deploy();

    // deploy staking-pool
    StakingPool = await ethers.getContractFactory("StakingPool");
    stakingPool = await StakingPool.deploy();

    // mint token
    usdt.mint(addr1.address, 10000);
    usdt.mint(rewardDistributor.address, 9999);

    // approve token
    usdt.connect(addr1).approve(stakingPool.address, 10000);
    usdt.connect(rewardDistributor).approve(stakingPool.address, 9999);

    const balanceOfAddr1 = await usdt.balanceOf(addr1.address);
    console.log("balanceOfAddr1: ", balanceOfAddr1);

    await stakingPool.__StakingPool_init();
    await stakingPool.setRewardDistributor(rewardDistributor.address);
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

      // test total staked amount of pool
      expect(await stakingPool.totalStakedOfPool(0)).to.equal(200);

      // test pending reward
      expect(await stakingPool.connect(addr1).getPendingReward(0, 0)).to.equal(
        100 * 30
      );
    });
  });

  describe("test claim function", () => {
    it("claim success", async () => {
      await stakingPool
        .connect(owner)
        .createPool(usdt.address, 1000, 30, 0, 600);
      await stakingPool.connect(addr1).deposit(0, 100);
      await stakingPool.connect(addr1).deposit(0, 200);

      // withdraw token
      await stakingPool.connect(addr1).withdraw(0, 100, 0);
      // pending = 100 * 30
      console.log("rewardDistributor: ", rewardDistributor.address);
      console.log("owner test: ", owner.address);
      console.log("addr1 test: ", addr1.address);
      // claim reward
      await stakingPool.connect(addr1).claimRewardPool(0, 0);

      expect(await stakingPool.connect(addr1).getPendingReward(0, 0)).to.equal(
        0
      );
    });
  });
});
