// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimitedNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 private _nextTokenId;

    mapping(address => bool) private _hasMinted;

    constructor(address initialOwner)
        ERC721("DefiversoPortalDoDev", "DEFIDEV")
        Ownable(initialOwner)
    {}

    function mint() external {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(!_hasMinted[msg.sender], "Already minted");

        _hasMinted[msg.sender] = true;
        _safeMint(msg.sender, _nextTokenId);
        _nextTokenId++;
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function hasMinted(address wallet) external view returns (bool) {
        return _hasMinted[wallet];
    }
}
