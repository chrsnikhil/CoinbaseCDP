import { bounties } from './bounties';
import Link from 'next/link';

export default function BountiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Bounties
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover exciting opportunities and earn rewards for your
            contributions
          </p>
        </div>

        {/* Bounties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty, index) => (
            <div
              key={bounty.id}
              className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">💎</span>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                    ACTIVE
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {bounty.title}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {bounty.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Reward</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ${bounty.usdcAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        USDC
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Deadline</span>
                    <span className="text-orange-400 text-sm font-medium">
                      {new Date(bounty.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/bounties/${bounty.id}`}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
            <span>✨</span>
            <span>More bounties coming soon</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
