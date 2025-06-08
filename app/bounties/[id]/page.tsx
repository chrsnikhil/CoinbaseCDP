import '@coinbase/onchainkit/styles.css';

import { bounties } from '../bounties';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Wallet } from '@coinbase/onchainkit/wallet';

export default async function BountyPage({
  params,
}: {
  params: { id: string };
}) {
  const parameters = await params;
  const bounty = bounties.find(b => b.id.toString() === parameters.id);
  if (!bounty) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/bounties"
            className="inline-flex items-center text-purple-300 hover:text-white transition-colors duration-200 mb-6 group"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Bounties
          </Link>
        </div>

        {/* Main content card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Header section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {bounty.title}
            </h1>
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                <div className="text-3xl font-bold text-white">
                  ${bounty.usdcAmount.toLocaleString()}
                </div>
                <div className="text-purple-100 text-sm font-medium">
                  USDC Reward
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                <div className="text-xl font-bold text-white">
                  {new Date(bounty.deadline).toLocaleDateString()}
                </div>
                <div className="text-purple-100 text-sm font-medium">
                  Deadline
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Description
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {bounty.description}
              </p>
            </div>

            {/* Commitment fee notice */}
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-500 rounded-full p-2 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-amber-300 font-semibold mb-2">
                    Commitment Required
                  </h3>
                  <p className="text-amber-100">
                    You&apos;ll need to pay a commitment fee of{' '}
                    <span className="font-bold">0.50 USDC</span> to complete
                    this bounty. This ensures serious participation and will be
                    refunded upon successful completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet section */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h3>
              <div className="mb-4">
                <Wallet />
              </div>
              <p className="text-gray-400 text-sm">
                Connect your wallet to participate in this bounty and make the
                commitment payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
