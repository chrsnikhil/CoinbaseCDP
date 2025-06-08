'use client';

import { useWriteContract } from 'wagmi';
import { taskManagerConfig } from '@/utils/wagmi';
import { useState } from 'react';
import { parseEther } from 'viem';

export default function CreateTask() {
  const [bounty, setBounty] = useState('');
  const { writeContract } = useWriteContract();

  const handleCreateTask = async () => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'createTask',
        value: parseEther(bounty),
      });
      setBounty('');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bounty (ETH)</label>
          <input
            type="number"
            value={bounty}
            onChange={(e) => setBounty(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter bounty amount in ETH"
          />
        </div>
        <button
          onClick={handleCreateTask}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Task
        </button>
      </div>
    </div>
  );
} 