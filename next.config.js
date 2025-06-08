/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@coinbase/wallet-sdk',
    'connectkit',
  ],
};

module.exports = nextConfig; 