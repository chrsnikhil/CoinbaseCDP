'use client';

import { useReadContract, useWriteContract } from 'wagmi';
import { taskManagerConfig } from '@/utils/wagmi';
import { useState } from 'react';

export default function PlatformWallet() {
  const [newFee, setNewFee] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const { writeContract } = useWriteContract();

  // Read platform wallet
  const { data: platformWallet } = useReadContract({
    ...taskManagerConfig,
    functionName: 'platformWallet',
  });

  const handleSetPlatformFee = async () => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'setPlatformFee',
        args: [BigInt(newFee)],
      });
      setNewFee('');
    } catch (error) {
      console.error('Error setting platform fee:', error);
    }
  };

  const handleSetPlatformWallet = async () => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'setPlatformWallet',
        args: [newWallet as `0x${string}`],
      });
      setNewWallet('');
    } catch (error) {
      console.error('Error setting platform wallet:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
      
      <div className="space-y-4">
        <div>
          <div className="mt-2">
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter new platform fee in basis points (e.g., 250 = 2.5%)"
            />
            <button
              onClick={handleSetPlatformFee}
              className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Platform Fee
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Current Platform Wallet: {platformWallet}</p>
          <div className="mt-2">
            <input
              type="text"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter new platform wallet address"
            />
            <button
              onClick={handleSetPlatformWallet}
              className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Platform Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 