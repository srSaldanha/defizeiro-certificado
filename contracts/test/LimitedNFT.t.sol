// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {LimitedNFT} from "../src/LimitedNFT.sol";

contract LimitedNFTTest is Test {
    LimitedNFT public nft;
    address public owner = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);

    string constant URI_ALICE = "https://res.cloudinary.com/dgpmzfhos/raw/upload/defiverso/metadata/alice.json";
    string constant URI_BOB   = "https://res.cloudinary.com/dgpmzfhos/raw/upload/defiverso/metadata/bob.json";

    function setUp() public {
        nft = new LimitedNFT(owner);
    }

    function test_MintSuccess() public {
        vm.prank(alice);
        nft.mint(URI_ALICE);

        assertEq(nft.totalSupply(), 1);
        assertEq(nft.ownerOf(0), alice);
        assertTrue(nft.hasMinted(alice));
        assertEq(nft.tokenURI(0), URI_ALICE);
    }

    function test_RevertWhen_MintTwice() public {
        vm.startPrank(alice);
        nft.mint(URI_ALICE);
        vm.expectRevert("Already minted");
        nft.mint(URI_ALICE);
        vm.stopPrank();
    }

    function test_RevertWhen_EmptyURI() public {
        vm.prank(alice);
        vm.expectRevert("Empty metadata URI");
        nft.mint("");
    }

    function test_MultipleDifferentUsers() public {
        vm.prank(alice);
        nft.mint(URI_ALICE);

        vm.prank(bob);
        nft.mint(URI_BOB);

        assertEq(nft.totalSupply(), 2);
        assertEq(nft.ownerOf(0), alice);
        assertEq(nft.ownerOf(1), bob);
        assertEq(nft.tokenURI(0), URI_ALICE);
        assertEq(nft.tokenURI(1), URI_BOB);
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
            nft.mint(string(abi.encodePacked("https://cloudinary.com/", vm.toString(i), ".json")));
        }

        address latecomer = address(0x9999);
        vm.prank(latecomer);
        vm.expectRevert("Max supply reached");
        nft.mint(URI_ALICE);
    }
}
