import { Bounty } from '../../types/index';

export const bounties: Bounty[] = [
  {
    id: 1,
    title: 'Smart Contract Security Audit',
    description:
      'Conduct a comprehensive security audit of our DeFi smart contract including vulnerability assessment and gas optimization recommendations.',
    usdcAmount: 5000,
    deadline: new Date('2024-02-15T23:59:59.000Z'),
  },
  {
    id: 2,
    title: 'Frontend React Component Development',
    description:
      'Build a responsive dashboard component for displaying real-time cryptocurrency portfolio data with charts and analytics.',
    usdcAmount: 2500,
    deadline: new Date('2024-01-30T18:00:00.000Z'),
  },
  {
    id: 3,
    title: 'API Integration for Price Feeds',
    description:
      'Integrate multiple cryptocurrency price feed APIs with error handling, rate limiting, and data normalization.',
    usdcAmount: 1800,
    deadline: new Date('2024-02-01T12:00:00.000Z'),
  },
  {
    id: 4,
    title: 'Database Schema Optimization',
    description:
      'Optimize PostgreSQL database schema for handling high-frequency trading data with improved query performance and indexing strategies.',
    usdcAmount: 3200,
    deadline: new Date('2024-02-10T16:30:00.000Z'),
  },
  {
    id: 5,
    title: 'Mobile App Bug Fixes',
    description:
      'Fix critical bugs in the iOS and Android mobile trading app including crash issues on startup and transaction history display problems.',
    usdcAmount: 1500,
    deadline: new Date('2024-01-25T20:00:00.000Z'),
  },
];
