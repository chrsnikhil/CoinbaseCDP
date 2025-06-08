import { expect } from "chai";
import { ethers } from "hardhat";
import { PaymentHandler, Escrow } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("PaymentHandler", function () {
  let paymentHandler: PaymentHandler;
  let escrow: Escrow;
  let payer: HardhatEthersSigner;
  let payee: HardhatEthersSigner;

  beforeEach(async function () {
    [payer, payee] = await ethers.getSigners();

    // Deploy Escrow first
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();

    // Deploy PaymentHandler with Escrow address
    const PaymentHandler = await ethers.getContractFactory("PaymentHandler");
    paymentHandler = await PaymentHandler.deploy(await escrow.getAddress());
  });

  describe("Payment Handling", function () {
    it("Should create escrow through payment handler", async function () {
      const amount = ethers.parseEther("1.0");

      await expect(paymentHandler.handlePayment(payee.address, { value: amount }))
        .to.emit(escrow, "EscrowCreated");

      // Verify escrow was created
      const escrowCount = await escrow.getEscrowCount();
      expect(escrowCount).to.equal(1);
    });

    it("Should fail if payment amount is zero", async function () {
      await expect(
        paymentHandler.handlePayment(payee.address, { value: 0 })
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });
}); 