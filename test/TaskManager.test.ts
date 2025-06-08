import { expect } from "chai";
import { ethers } from "hardhat";
import { CDPWalletManager } from "../scripts/cdpWallet";
import { TaskManager } from "../typechain-types";
import { Amount } from "@coinbase/coinbase-sdk";

describe("TaskManager", function () {
    let taskManager: TaskManager;
    let walletManager: CDPWalletManager;
    let owner: any;
    let poster: any;
    let doer: any;
    let taskId: bigint;
    const paymentAmount = ethers.parseEther("1.0"); // 1 ETH
    const description = "Test task description";

    beforeEach(async function () {
        // Get signers
        [owner, poster, doer] = await ethers.getSigners();

        // Deploy TaskManager contract
        const TaskManager = await ethers.getContractFactory("TaskManager");
        taskManager = await TaskManager.deploy();
        await taskManager.waitForDeployment();

        // Initialize CDP wallet manager
        walletManager = CDPWalletManager.getInstance();

        // Create wallets for testing
        await walletManager.createUserWallet("poster");
        await walletManager.createUserWallet("doer");
    });

    describe("Task Creation", function () {
        it("Should create a task with correct payment amount", async function () {
            // Create task
            await walletManager.createTask(
                "poster",
                await taskManager.getAddress(),
                description,
                paymentAmount as unknown as Amount
            );

            // Get task details
            const task = await taskManager.getTask(1);
            expect(task.poster).to.equal(await walletManager.getUserAddress("poster"));
            expect(task.paymentAmount).to.equal(paymentAmount);
            expect(task.description).to.equal(description);
            expect(task.isActive).to.be.true;
        });

        it("Should calculate correct commitment fee", async function () {
            // Create task
            await walletManager.createTask(
                "poster",
                await taskManager.getAddress(),
                description,
                paymentAmount as unknown as Amount
            );

            // Get task details
            const task = await taskManager.getTask(1);
            const expectedCommitmentFee = (paymentAmount * BigInt(500)) / BigInt(10000); // 5%
            expect(task.commitmentFee).to.equal(expectedCommitmentFee);
        });
    });

    describe("Task Application", function () {
        beforeEach(async function () {
            // Create task first
            await walletManager.createTask(
                "poster",
                await taskManager.getAddress(),
                description,
                paymentAmount as unknown as Amount
            );
            taskId = BigInt(1);
        });

        it("Should allow doer to apply with commitment fee", async function () {
            const task = await taskManager.getTask(taskId);
            
            // Apply for task
            await walletManager.applyForTask(
                "doer",
                await taskManager.getAddress(),
                taskId,
                task.commitmentFee as unknown as Amount
            );

            // Verify task assignment
            const updatedTask = await taskManager.getTask(taskId);
            expect(updatedTask.doer).to.equal(await walletManager.getUserAddress("doer"));
        });

        it("Should not allow application with incorrect commitment fee", async function () {
            const wrongFee = ethers.parseEther("0.1"); // Wrong fee amount

            await expect(
                walletManager.applyForTask(
                    "doer",
                    await taskManager.getAddress(),
                    taskId,
                    wrongFee as unknown as Amount
                )
            ).to.be.revertedWith("Incorrect commitment fee");
        });
    });

    describe("Task Completion and Approval", function () {
        beforeEach(async function () {
            // Create and assign task
            await walletManager.createTask(
                "poster",
                await taskManager.getAddress(),
                description,
                paymentAmount as unknown as Amount
            );
            taskId = BigInt(1);

            const task = await taskManager.getTask(taskId);
            await walletManager.applyForTask(
                "doer",
                await taskManager.getAddress(),
                taskId,
                task.commitmentFee as unknown as Amount
            );
        });

        it("Should allow doer to complete task", async function () {
            await walletManager.completeTask(
                "doer",
                await taskManager.getAddress(),
                taskId
            );

            const task = await taskManager.getTask(taskId);
            expect(task.isCompleted).to.be.true;
        });

        it("Should allow poster to approve completed task", async function () {
            // Complete task first
            await walletManager.completeTask(
                "doer",
                await taskManager.getAddress(),
                taskId
            );

            // Approve task
            await walletManager.approveTask(
                "poster",
                await taskManager.getAddress(),
                taskId
            );

            const task = await taskManager.getTask(taskId);
            expect(task.isApproved).to.be.true;
            expect(task.isActive).to.be.false;
        });

        it("Should allow poster to reject completed task", async function () {
            // Complete task first
            await walletManager.completeTask(
                "doer",
                await taskManager.getAddress(),
                taskId
            );

            // Reject task
            await walletManager.rejectTask(
                "poster",
                await taskManager.getAddress(),
                taskId
            );

            const task = await taskManager.getTask(taskId);
            expect(task.isApproved).to.be.false;
            expect(task.isActive).to.be.false;
            expect(task.isCompleted).to.be.false;
        });
    });

    describe("Access Control", function () {
        it("Should only allow owner to update commitment fee percentage", async function () {
            const newPercentage = 1000; // 10%

            // Should succeed for owner
            await taskManager.updateCommitmentFeePercentage(newPercentage);
            expect(await taskManager.commitmentFeePercentage()).to.equal(newPercentage);

            // Should fail for non-owner
            await expect(
                taskManager.connect(poster).updateCommitmentFeePercentage(newPercentage)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should only allow owner to perform emergency withdrawal", async function () {
            // Should succeed for owner
            await taskManager.emergencyWithdraw();

            // Should fail for non-owner
            await expect(
                taskManager.connect(poster).emergencyWithdraw()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });
}); 