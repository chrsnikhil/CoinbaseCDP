import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Escrow", function () {
  let escrow: Escrow;
  let payer: HardhatEthersSigner;
  let payee: HardhatEthersSigner;

  beforeEach(async function () {
    [payer, payee] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy();
  });

  describe("Escrow Creation", function () {
    it("Should create a new escrow with correct amount", async function () {
      const amount = ethers.parseEther("1.0");

      const tx = await escrow.createEscrow(payee.address, { value: amount });
      const receipt = await tx.wait();

      // Get the EscrowCreated event
      const event = receipt?.logs[0];
      const escrowId = event?.topics[1];

      const escrowData = await escrow.escrows(escrowId);
      expect(escrowData.payer).to.equal(payer.address);
      expect(escrowData.payee).to.equal(payee.address);
      expect(escrowData.amount).to.equal(amount);
      expect(escrowData.released).to.be.false;
      expect(escrowData.refunded).to.be.false;
    });

    it("Should fail if amount is zero", async function () {
      await expect(
        escrow.createEscrow(payee.address, { value: 0 })
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });
}); 