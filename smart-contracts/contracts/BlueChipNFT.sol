// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract BlueChipNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant MINT_PRICE = 0.1 ether;
    uint256 public constant MAX_SUPPLY = 10000;

    constructor() ERC721("BlueChip NFT", "BLUE") Ownable(msg.sender) {}

    function mint() public payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_tokenIds.current() < MAX_SUPPLY, "Max supply reached");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://YOUR_BASE_URI/";
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}
