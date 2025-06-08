"use client";

import { useCallback, useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { parseEther } from "viem";
import { Wallet } from "@coinbase/onchainkit/wallet";

// TaskManager contract ABI (minimal version for testing)
const TASK_MANAGER_ABI = [
  {
    inputs: [{ name: "_description", type: "string" }],
    name: "createTask",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "_taskId", type: "uint256" }],
    name: "assignTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_taskId", type: "uint256" },
      { name: "_submissionUrl", type: "string" },
    ],
    name: "completeTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_taskId", type: "uint256" }],
    name: "releasePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_taskId", type: "uint256" }],
    name: "getTask",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "poster", type: "address" },
      { name: "doer", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "description", type: "string" },
      { name: "isCompleted", type: "bool" },
      { name: "isPaid", type: "bool" },
      { name: "createdAt", type: "uint256" },
      { name: "submissionUrl", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Your deployed contract address
const TASK_MANAGER_ADDRESS = "0x663b9F5DD858fc5D0402E154d4Ae72d8aD42fc71" as `0x${string}`;

const contractConfig = {
  address: TASK_MANAGER_ADDRESS,
  abi: TASK_MANAGER_ABI,
};

export default function TasksPage() {
  const { isConnected } = useAccount();
  const [taskId, setTaskId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [submissionUrl, setSubmissionUrl] = useState<string>("");

  // Contract write hooks (matching CreateTask.tsx pattern)
  const { write: createTask } = useContractWrite({
    ...contractConfig,
    functionName: "createTask",
  });
  const { write: assignTask } = useContractWrite({
    ...contractConfig,
    functionName: "assignTask",
  });
  const { write: completeTask } = useContractWrite({
    ...contractConfig,
    functionName: "completeTask",
  });
  const { write: releasePayment } = useContractWrite({
    ...contractConfig,
    functionName: "releasePayment",
  });

  // Contract read hook for getting task details
  const { data: taskData } = useContractRead({
    ...contractConfig,
    functionName: "getTask",
    args: taskId ? [BigInt(taskId)] : undefined,
  });

  const handleCreateTask = useCallback(() => {
    if (!createTask || !description || !amount) return;
    createTask({
      args: [description],
      value: parseEther(amount),
    });
  }, [createTask, description, amount]);

  const handleAssignTask = useCallback(() => {
    if (!assignTask || !taskId) return;
    assignTask({
      args: [BigInt(taskId)],
    });
  }, [assignTask, taskId]);

  const handleCompleteTask = useCallback(() => {
    if (!completeTask || !taskId || !submissionUrl) return;
    completeTask({
      args: [BigInt(taskId), submissionUrl],
    });
  }, [completeTask, taskId, submissionUrl]);

  const handleReleasePayment = useCallback(() => {
    if (!releasePayment || !taskId) return;
    releasePayment({
      args: [BigInt(taskId)],
    });
  }, [releasePayment, taskId]);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Please connect your wallet</h1>
        <Wallet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>
      {/* Create Task Form */}
      <div className="w-full max-w-md mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreateTask}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Task
          </button>
        </div>
      </div>
      {/* Task Actions */}
      <div className="w-full max-w-md mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Task Actions</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Task ID"
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Submission URL"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleAssignTask}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Assign Task
            </button>
            <button
              onClick={handleCompleteTask}
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
            >
              Complete Task
            </button>
            <button
              onClick={handleReleasePayment}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              Release Payment
            </button>
          </div>
        </div>
      </div>
      {/* Task Details */}
      {taskData && (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
          <div className="space-y-2">
            <p>ID: {taskData[0].toString()}</p>
            <p>Poster: {taskData[1]}</p>
            <p>Doer: {taskData[2]}</p>
            <p>Amount: {taskData[3].toString()} wei</p>
            <p>Description: {taskData[4]}</p>
            <p>Completed: {taskData[5].toString()}</p>
            <p>Paid: {taskData[6].toString()}</p>
            <p>Created At: {new Date(Number(taskData[7]) * 1000).toLocaleString()}</p>
            <p>Submission URL: {taskData[8]}</p>
          </div>
        </div>
      )}
    </div>
  );
} 