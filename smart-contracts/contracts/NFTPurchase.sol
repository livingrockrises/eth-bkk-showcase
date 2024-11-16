// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract NFTPurchase is ERC721, Ownable {
    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private _tokenIds;

    // Price in ERC20 tokens to mint an NFT
    uint256 public mintPrice;

    // ERC20 token used for payment
    IERC20 public paymentToken;

    constructor(
        string memory name,
        string memory symbol,
        address _paymentToken,
        uint256 _mintPrice
    )
        ERC721(name, symbol)
        Ownable(msg.sender)
    {
        require(_paymentToken != address(0), "Invalid payment token address");
        require(_mintPrice > 0, "Mint price must be greater than 0");
        paymentToken = IERC20(_paymentToken);
        mintPrice = _mintPrice;
    }

    /**
     * @notice Mints a new NFT by paying with ERC20 tokens
     */
    function mint() external {
        // Check payment token allowance
        require(
            paymentToken.allowance(msg.sender, address(this)) >= mintPrice,
            "Insufficient token allowance"
        );

        // Transfer payment tokens from user
        require(
            paymentToken.transferFrom(msg.sender, address(this), mintPrice), "Token transfer failed"
        );

        // Mint NFT
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
    }

    /**
     * @notice Allows owner to withdraw accumulated fees
     * @param amount Amount of tokens to withdraw
     */
    function withdrawFees(uint256 amount) external onlyOwner {
        require(paymentToken.transfer(msg.sender, amount), "Fee withdrawal failed");
    }

    /**
     * @notice Allows owner to update mint price
     * @param newPrice New price in payment tokens
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        mintPrice = newPrice;
    }
}
