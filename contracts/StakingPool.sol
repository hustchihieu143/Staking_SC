//SPDX-License-Identifier: MIT
pragma solidity 0.8.2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract StakingPool {
    // hash role admin
    bytes32 public constant ADMIN = keccak256("ADMIN");

    // address to receive the money
    address public coldWalletAddress;

    // pool info
    struct StakingPoolInfo {
        IERC20 acceptedToken;
        uint256 cap;
        uint256 totalStaked;
        uint256 APR;
        uint256 lockDuration;
        uint256 delayDuration;
    }

    // data staking in user
    struct UserStakingData {
        uint256 balance;
        uint256 stakeTime;
        uint256 lastClaimTime;
        uint256 pendingReward;
        uint256 APR;
    }

    // data withdraw of user
    struct UserPendingWithdrawl {
        uint256 amount;
        uint256 applicableAt;
    }

    // data of all user
    struct StakingData {
        uint256 balance;
        uint256 stakingDataRecordCount;
    }
}
