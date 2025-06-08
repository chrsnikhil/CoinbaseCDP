'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { processFreelancePayment, createX402WalletClient, createFetchWithPayment } from '@/utils/x402';

interface PaymentButtonProps {
  projectId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function PaymentButton({ projectId, amount, onSuccess, onError }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();

  const handlePayment = async () => {
    if (!address) {
      onError?.({ message: 'Please connect your wallet first' });
      return;
    }

    setIsLoading(true);
    try {
      // In a real application, you would get the private key securely
      // This is just for demonstration
      const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('Wallet private key not configured');
      }

      const walletClient = createX402WalletClient(privateKey);
      const fetchWithPayment = createFetchWithPayment(walletClient);

      const result = await processFreelancePayment(
        projectId,
        amount,
        fetchWithPayment
      );

      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || !address}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
    >
      {isLoading ? 'Processing...' : `Pay ${amount} USDC`}
    </button>
  );
} 