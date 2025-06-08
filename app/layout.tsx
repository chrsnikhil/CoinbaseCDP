import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from '@/utils/providers';
import { WagmiProviders } from '@/utils/wagmi';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coinbase CDP',
  description: 'coinbase cdp site',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <WagmiProviders>
          <body className={inter.className}>{children}</body>
        </WagmiProviders>
      </Providers>
    </html>
  );
}
