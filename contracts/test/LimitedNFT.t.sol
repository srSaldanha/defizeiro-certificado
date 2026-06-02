// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {LimitedNFT} from "../src/LimitedNFT.sol";

contract LimitedNFTTest is Test {
    LimitedNFT public nft;
    address public owner = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);

    function setUp() public {
        nft = new LimitedNFT(owner);
    }

    function test_MintSuccess() public {
        vm.prank(alice);
        nft.mint();

        assertEq(nft.totalSupply(), 1);
        assertEq(nft.ownerOf(0), alice);
        assertTrue(nft.hasMinted(alice));
    }

    function test_RevertWhen_MintTwice() public {
        vm.startPrank(alice);
        nft.mint();
        vm.expectRevert("Already minted");
        nft.mint();
        vm.stopPrank();
    }

    function test_MultipleDifferentUsers() public {
        vm.prank(alice);
        nft.mint();

        vm.prank(bob);
        nft.mint();

        assertEq(nft.totalSupply(), 2);
        assertEq(nft.ownerOf(0), alice);
        assertEq(nft.ownerOf(1), bob);
    }

    function test_HasMintedReturnsFalseBeforeMint() public view {
        assertFalse(nft.hasMinted(alice));
    }

    function test_MaxSupplyConstant() public view {
        assertEq(nft.MAX_SUPPLY(), 1000);
    }

    function test_RevertWhen_MaxSupplyReached() public {
        for (uint256 i = 0; i < 1000; i++) {
            address user = address(uint160(i + 100));
            vm.prank(user);
            nft.mint();
        }

        address latecomer = address(0x9999);
        vm.prank(latecomer);
        vm.expectRevert("Max supply reached");
        nft.mint();
    }
}
