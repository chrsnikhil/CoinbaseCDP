import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";

// Initialize wallet client
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http()
});

// Create a wrapped fetch function that handles x402 payments
export const fetchWithPayment = wrapFetchWithPayment(fetch, account);

// Helper function to make paid API requests
export async function makePaidRequest(url: string, options?: RequestInit) {
  try {
    const response = await fetchWithPayment(url, options);
    
    // Check if this was a paid request
    const paymentResponse = response.headers.get('x-payment-response');
    if (paymentResponse) {
      const decodedPayment = decodeXPaymentResponse(paymentResponse);
      console.log('Payment details:', decodedPayment);
    }

    return response;
  } catch (error) {
    console.error('Error making paid request:', error);
    throw error;
  }
}

// Helper function to check if a response requires payment
export function requiresPayment(response: Response): boolean {
  return response.status === 402;
}

// Helper function to get payment details from a 402 response
export async function getPaymentDetails(response: Response) {
  if (!requiresPayment(response)) {
    return null;
  }

  const paymentResponse = response.headers.get('x-payment-response');
  if (!paymentResponse) {
    return null;
  }

  return decodeXPaymentResponse(paymentResponse);
}

// Create wallet client
export const createX402WalletClient = (privateKey: string) => {
  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    account,
    chain: baseSepolia,
    transport: http()
  });
};

// Create fetch with payment wrapper
export const createFetchWithPayment = (account: any) => {
  return wrapFetchWithPayment(fetch, account);
};

// Payment handling utility
export const handleX402Payment = async (
  url: string,
  fetchWithPayment: any,
  options: RequestInit = {}
) => {
  try {
    const response = await fetchWithPayment(url, {
      method: "GET",
      ...options,
    });

    const body = await response.json();
    const paymentResponse = decodeXPaymentResponse(
      response.headers.get("x-payment-response")!
    );

    return {
      data: body,
      payment: paymentResponse,
    };
  } catch (error: any) {
    console.error("Payment error:", error.response?.data?.error);
    throw error;
  }
};

// Example usage for freelance gig payment
export const processFreelancePayment = async (
  projectId: string,
  amount: number,
  fetchWithPayment: any
) => {
  const paymentUrl = `/api/projects/${projectId}/payment`;
  
  return handleX402Payment(paymentUrl, fetchWithPayment, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
}; 