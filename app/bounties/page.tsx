import { bounties } from './bounties';
import Link from 'next/link';

export default function BountiesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bounties</h1>
      <ul className="space-y-4">
        {bounties.map(bounty => (
          <li
            key={bounty.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{bounty.title}</h2>
            <p className="text-gray-700 mt-2">{bounty.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">
                ${bounty.usdcAmount.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                Deadline: {new Date(bounty.deadline).toLocaleDateString()}
              </span>
              <Link
                href={`/bounties/${bounty.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
