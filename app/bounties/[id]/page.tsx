import { bounties } from '../bounties';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{bounty.title}</h1>
      <p className="text-gray-700 mb-4">{bounty.description}</p>
      <div className="mb-4">
        <span className="text-lg font-bold text-green-600">
          ${bounty.usdcAmount.toLocaleString()}
        </span>
      </div>
      <div className="text-sm text-gray-500 mb-6">
        Deadline: {new Date(bounty.deadline).toLocaleDateString()}
      </div>
      <Link href="/bounties" className="text-blue-500 hover:underline">
        Back to Bounties
      </Link>
    </div>
  );
}
