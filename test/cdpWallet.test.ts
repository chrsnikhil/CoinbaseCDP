import { expect } from "chai";
import { CDPWalletManager } from "../scripts/cdpWallet";
import { Coinbase } from "@coinbase/coinbase-sdk";

describe("CDPWalletManager", function () {
    let walletManager: CDPWalletManager;

    beforeEach(async function () {
        walletManager = CDPWalletManager.getInstance();
    });

    describe("Wallet Creation", function () {
        it("Should create a new wallet", async function () {
            const wallet = await walletManager.createUserWallet("test-user-1");
            expect(wallet).to.not.be.null;
            expect(wallet.toString()).to.be.a("string");
        });

        it("Should get default address", async function () {
            const address = await walletManager.getUserAddress("test-user-2");
            expect(address).to.be.a("string");
            expect(address.length).to.be.greaterThan(0);
        });
    });

    describe("Testnet Operations", function () {
        it("Should fund wallet with testnet ETH", async function () {
            const userId = "test-user-3";
            await walletManager.fundWalletWithTestnet(userId);
            // Note: This will only work on testnet
        });

        it("Should transfer testnet ETH between wallets", async function () {
            const fromUserId = "test-user-4";
            const toUserId = "test-user-5";
            
            // Fund the source wallet first
            await walletManager.fundWalletWithTestnet(fromUserId);
            
            // Transfer a small amount
            await walletManager.transferFunds(
                fromUserId,
                toUserId,
                0.00001,
                Coinbase.assets.Eth
            );
        });
    });

    describe("Mainnet Operations", function () {
        it("Should trade assets on mainnet", async function () {
            const userId = "test-user-6";
            
            // This will fail without real funds
            await expect(
                walletManager.tradeAssets(
                    userId,
                    Coinbase.assets.Eth,
                    Coinbase.assets.Usdc,
                    0.00001
                )
            ).to.be.rejected;
        });
    });

    describe("Wallet Import", function () {
        it("Should import wallet using mnemonic phrase", async function () {
            const userId = "test-user-7";
            const mnemonicPhrase = process.env.TEST_MNEMONIC_PHRASE || "test test test test test test test test test test test junk";
            
            const wallet = await walletManager.importWallet(userId, mnemonicPhrase);
            expect(wallet).to.not.be.null;
            expect(wallet.toString()).to.be.a("string");
        });
    });
}); 