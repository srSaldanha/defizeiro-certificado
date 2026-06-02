// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimitedNFT is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 private _nextTokenId;

    mapping(address => bool) private _hasMinted;
    mapping(uint256 => string) private _tokenURIs;

    constructor(address initialOwner)
        ERC721("DefiversoPortalDoDev", "DEFIDEV")
        Ownable(initialOwner)
    {}

    function mint(string calldata metadataURI) external {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        require(!_hasMinted[msg.sender], "Already minted");
        require(bytes(metadataURI).length > 0, "Empty metadata URI");

        uint256 tokenId = _nextTokenId;
        _hasMinted[msg.sender] = true;
        _tokenURIs[tokenId] = metadataURI;
        _safeMint(msg.sender, tokenId);
        _nextTokenId++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    function hasMinted(address wallet) external view returns (bool) {
        return _hasMinted[wallet];
    }
}
