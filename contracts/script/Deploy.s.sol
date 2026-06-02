// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {LimitedNFT} from "../src/LimitedNFT.sol";

contract Deploy is Script {
    function run() external returns (LimitedNFT) {
        address deployer = vm.envAddress("DEPLOYER_ADDRESS");

        vm.startBroadcast();
        LimitedNFT nft = new LimitedNFT(deployer);
        vm.stopBroadcast();

        return nft;
    }
}
