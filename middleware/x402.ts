import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { paymentMiddleware, Network } from 'x402-express';
import { TaskManagerABI } from '@/utils/contracts/TaskManagerABI';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

// Define the payment config type
type PaymentConfig = {
  [key: string]: {
    price: string;
    network: string;
    description: string;
  };
};

// Configure payment middleware
const paymentConfig: PaymentConfig = {
  "GET /api/tasks": {
    price: "$0.001", // Price in USDC
    network: "base-sepolia",
    description: "Access to task list",
  },
  "POST /api/tasks": {
    price: "$0.002", // Price in USDC
    network: "base-sepolia",
    description: "Create new task",
  },
  // Add more routes as needed
};

// Create a public client to read from the contract
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

// Get the platform wallet address from the contract
async function getPlatformWalletAddress() {
  try {
    const address = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS as `0x${string}`,
      abi: TaskManagerABI,
      functionName: 'platformWallet',
    });
    return address;
  } catch (error) {
    console.error('Error getting platform wallet address:', error);
    throw error;
  }
}

// Facilitator URL for Base Sepolia testnet
const FACILITATOR_URL = "https://x402.org/facilitator";

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const route = `${request.method} ${request.nextUrl.pathname}`;
  const routeConfig = paymentConfig[route];

  if (!routeConfig) {
    return NextResponse.next();
  }

  // Get the platform wallet address
  const platformWalletAddress = await getPlatformWalletAddress();

  // Check for payment header
  const paymentHeader = request.headers.get('x-payment');
  if (!paymentHeader) {
    return new NextResponse(
      JSON.stringify({
        error: 'Payment required',
        message: 'This endpoint requires payment',
        price: routeConfig.price,
        network: routeConfig.network,
        receivingAddress: platformWalletAddress, // Use platform wallet as receiving address
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'x-payment-required': 'true',
        },
      }
    );
  }

  // Verify payment (this would typically involve checking with the facilitator)
  // For now, we'll just pass through if the header exists
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 