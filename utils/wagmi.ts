import { http, createConfig } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { TaskManagerABI } from './contracts/TaskManagerABI';

// Create the wagmi config
export const config = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  transports: {
    [baseSepolia.id]: http(),
  },
});

// Contract configuration
export const taskManagerConfig = {
  address: process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS as `0x${string}`,
  abi: TaskManagerABI,
} as const; 