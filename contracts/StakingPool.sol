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
    bytes32 public constant ADMIN = keccak256("ADMIN");

    // pool info
    struct StakingPoolInfo {
        ;
    }

    // data staking in user
    struct UserStakingData {
        ;
    }

    // data withdraw of user
    struct UserPendingWithdrawl {
        ;
    }

    // data of all user
    struct StakingData {
        ;
    }
}
