import { Coinbase, Wallet, Amount } from "@coinbase/coinbase-sdk";

export class CDPWalletManager {
    private static instance: CDPWalletManager;
    private platformWallet: Wallet | null = null;
    private userWallets: Map<string, Wallet> = new Map();

    private constructor() {
        // Initialize with CDP API key from JSON file
        Coinbase.configureFromJson({ filePath: 'cdp_api_key.json' });
    }

    public static getInstance(): CDPWalletManager {
        if (!CDPWalletManager.instance) {
            CDPWalletManager.instance = new CDPWalletManager();
        }
        return CDPWalletManager.instance;
    }

    // Create platform wallet (2-of-2 Coinbase-Managed)
    async createPlatformWallet(): Promise<Wallet> {
        if (!this.platformWallet) {
            this.platformWallet = await Wallet.create({
                networkId: Coinbase.networks.BaseMainnet
            });
            console.log(`Platform wallet created: ${this.platformWallet.toString()}`);
        }
        return this.platformWallet;
    }

    // Create user wallet (Developer-Managed)
    async createUserWallet(userId: string): Promise<Wallet> {
        if (!this.userWallets.has(userId)) {
            const wallet = await Wallet.create({
                networkId: Coinbase.networks.BaseMainnet
            });
            console.log(`User wallet created: ${wallet.toString()}`);
            this.userWallets.set(userId, wallet);
        }
        return this.userWallets.get(userId)!;
    }

    // Get user's default address
    async getUserAddress(userId: string): Promise<string> {
        const wallet = await this.createUserWallet(userId);
        const address = await wallet.getDefaultAddress();
        console.log(`User address: ${address.toString()}`);
        return address.toString();
    }

    // Get ETH balance
    async getETHBalance(userId: string): Promise<Amount> {
        const wallet = await this.createUserWallet(userId);
        return await wallet.getBalance(Coinbase.assets.Eth);
    }

    // Transfer ETH between wallets
    async transferETH(
        fromUserId: string,
        toUserId: string,
        amount: Amount
    ): Promise<void> {
        const fromWallet = await this.createUserWallet(fromUserId);
        const toWallet = await this.createUserWallet(toUserId);
        const toAddress = await toWallet.getDefaultAddress();

        const transfer = await fromWallet.createTransfer({
            amount,
            assetId: Coinbase.assets.Eth,
            destination: toAddress.toString()
        });

        await transfer.wait();

        if (transfer.getStatus() === 'complete') {
            console.log(`Transfer completed: ${transfer.toString()}`);
        } else {
            console.error(`Transfer failed: ${transfer.toString()}`);
            throw new Error('Transfer failed');
        }
    }

    // Fund wallet with ETH
    async fundWallet(
        userId: string,
        amount: Amount
    ): Promise<void> {
        const wallet = await this.createUserWallet(userId);
        
        const fundOperation = await wallet.fund({
            amount,
            assetId: Coinbase.assets.Eth
        });
        
        await fundOperation.wait();
        
        console.log(`Wallet funded successfully: ${fundOperation.toString()}`);
    }

    // Fund wallet with testnet ETH (for testing only)
    async fundWalletWithTestnet(userId: string): Promise<void> {
        const wallet = await this.createUserWallet(userId);
        const faucetTransaction = await wallet.faucet();
        await faucetTransaction.wait();
        console.log(`Faucet transaction completed: ${faucetTransaction.toString()}`);
    }

    // Create a task (poster pays ETH)
    async createTask(
        posterId: string,
        taskContractAddress: string,
        description: string,
        paymentAmount: Amount
    ): Promise<void> {
        const wallet = await this.createUserWallet(posterId);
        
        // Create task in smart contract
        const contractInvocation = await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "createTask",
            args: {
                _description: description,
                _paymentAmount: paymentAmount.toString()
            }
        });

        await contractInvocation.wait();
        console.log(`Task created: ${contractInvocation.toString()}`);
    }

    // Apply for a task (doer pays commitment fee)
    async applyForTask(
        doerId: string,
        taskContractAddress: string,
        taskId: bigint,
        commitmentFee: Amount
    ): Promise<void> {
        const wallet = await this.createUserWallet(doerId);
        
        const contractInvocation = await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "applyForTask",
            args: {
                _taskId: taskId.toString()
            }
        });

        await contractInvocation.wait();
        console.log(`Task application submitted: ${contractInvocation.toString()}`);
    }

    // Complete a task
    async completeTask(
        doerId: string,
        taskContractAddress: string,
        taskId: bigint
    ): Promise<void> {
        const wallet = await this.createUserWallet(doerId);
        
        const contractInvocation = await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "completeTask",
            args: {
                _taskId: taskId.toString()
            }
        });

        await contractInvocation.wait();
        console.log(`Task completed: ${contractInvocation.toString()}`);
    }

    // Approve a task
    async approveTask(
        posterId: string,
        taskContractAddress: string,
        taskId: bigint
    ): Promise<void> {
        const wallet = await this.createUserWallet(posterId);
        
        const contractInvocation = await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "approveTask",
            args: {
                _taskId: taskId.toString()
            }
        });

        await contractInvocation.wait();
        console.log(`Task approved: ${contractInvocation.toString()}`);
    }

    // Reject a task
    async rejectTask(
        posterId: string,
        taskContractAddress: string,
        taskId: bigint
    ): Promise<void> {
        const wallet = await this.createUserWallet(posterId);
        
        const contractInvocation = await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "rejectTask",
            args: {
                _taskId: taskId.toString()
            }
        });

        await contractInvocation.wait();
        console.log(`Task rejected: ${contractInvocation.toString()}`);
    }

    // Get task details
    async getTaskDetails(
        taskContractAddress: string,
        taskId: bigint
    ): Promise<any> {
        const wallet = await this.createPlatformWallet();
        
        return await wallet.invokeContract({
            contractAddress: taskContractAddress,
            method: "getTask",
            args: {
                _taskId: taskId.toString()
            }
        });
    }
} 