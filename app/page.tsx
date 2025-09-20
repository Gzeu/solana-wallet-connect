'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import WalletButton from '../components/WalletButton';
import BalanceCard from '../components/BalanceCard';
import SendSOLForm from '../components/SendSOLForm';
import NetworkStatus from '../components/NetworkStatus';

// Dynamically import to avoid hydration issues
const DynamicWalletButton = dynamic(() => import('../components/WalletButton'), {
  ssr: false,
});

export default function Home() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-bg/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SolanaWalletConnect</h1>
                <p className="text-sm text-gray-400">Solana dApp Demo</p>
              </div>
            </div>
            <DynamicWalletButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!connected ? (
          /* Welcome Section */
          <div className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to <span className="text-solana-purple">Solana</span>WalletConnect
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Connect your Solana wallet to view your balance, send SOL, and interact with the blockchain
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-card-bg p-6 rounded-xl border border-gray-800">
                  <div className="w-12 h-12 bg-solana-purple rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
                  <p className="text-gray-400 text-sm">Support for Phantom, Solflare and other popular Solana wallets</p>
                </div>
                
                <div className="bg-card-bg p-6 rounded-xl border border-gray-800">
                  <div className="w-12 h-12 bg-solana-green rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">View Balance</h3>
                  <p className="text-gray-400 text-sm">Real-time SOL balance tracking with automatic updates</p>
                </div>
                
                <div className="bg-card-bg p-6 rounded-xl border border-gray-800">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Send SOL</h3>
                  <p className="text-gray-400 text-sm">Fast and secure SOL transactions with confirmation tracking</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-gray-400">
                Connected with{' '}
                <span className="text-solana-green font-mono text-sm">
                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                </span>
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <BalanceCard />
                <NetworkStatus />
              </div>
              
              <div className="space-y-6">
                <SendSOLForm />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-dark-bg/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with Next.js, Solana Web3.js & Tailwind CSS</p>
            <p className="mt-1">Running on Solana Devnet • Made by George Pricop</p>
          </div>
        </div>
      </footer>
    </div>
  );
}