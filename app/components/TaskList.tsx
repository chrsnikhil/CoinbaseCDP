'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { TaskManagerABI } from '@/utils/contracts/TaskManagerABI';
import { useState, useEffect } from 'react';
import { taskManagerConfig } from '@/utils/wagmi';

interface Task {
  poster: string;
  doer: string;
  bounty: bigint;
  isCompleted: boolean;
  isAssigned: boolean;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Contract read function
  const { data: taskData, refetch: refetchTask } = useReadContract({
    ...taskManagerConfig,
    functionName: 'getTask',
  });

  const fetchTasks = async () => {
    const fetchedTasks: Task[] = [];
    for (let i = 0; i < 10; i++) {
      try {
        const { data: task } = await useReadContract({
          ...taskManagerConfig,
          functionName: 'getTask',
          args: [BigInt(i)],
        });
        
        if (task && task.poster !== '0x0000000000000000000000000000000000000000') {
          fetchedTasks.push(task);
        }
      } catch (error) {
        console.error(`Error fetching task ${i}:`, error);
      }
    }
    setTasks(fetchedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAssignTask = async (taskId: number) => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'assignTask',
        args: [BigInt(taskId)],
      });
      // Refetch tasks after assignment
      await fetchTasks();
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'completeTask',
        args: [BigInt(taskId)],
      });
      // Refetch tasks after completion
      await fetchTasks();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleReleasePayment = async (taskId: number) => {
    try {
      await writeContract({
        ...taskManagerConfig,
        functionName: 'releasePayment',
        args: [BigInt(taskId)],
      });
      // Refetch tasks after payment release
      await fetchTasks();
    } catch (error) {
      console.error('Error releasing payment:', error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="p-4 border rounded-lg">
          <p>Poster: {task.poster}</p>
          <p>Doer: {task.doer}</p>
          <p>Bounty: {task.bounty.toString()} ETH</p>
          <p>Status: {task.isCompleted ? 'Completed' : task.isAssigned ? 'Assigned' : 'Open'}</p>
          
          {!task.isAssigned && address !== task.poster && (
            <button
              onClick={() => handleAssignTask(index)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Assign Task
            </button>
          )}
          
          {task.isAssigned && address === task.doer && !task.isCompleted && (
            <button
              onClick={() => handleCompleteTask(index)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Complete Task
            </button>
          )}
          
          {task.isCompleted && address === task.poster && (
            <button
              onClick={() => handleReleasePayment(index)}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Release Payment
            </button>
          )}
        </div>
      ))}
    </div>
  );
} 