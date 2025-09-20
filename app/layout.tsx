import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import WalletContextProvider from '../contexts/WalletContextProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SolanaWalletConnect - Solana dApp',
  description: 'Connect your Solana wallet, view balance, and send SOL transactions',
  keywords: 'solana, wallet, phantom, dapp, blockchain, web3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg min-h-screen`}>
        <WalletContextProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </WalletContextProvider>
      </body>
    </html>
  );
}