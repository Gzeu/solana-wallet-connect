'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useBalance } from '../hooks/useBalance';
import { formatBalance, formatAddress } from '../utils/constants';

export default function BalanceCard() {
  const { publicKey, connected } = useWallet();
  const { balance, loading } = useBalance();

  if (!connected || !publicKey) {
    return (
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Wallet Balance</h3>
        <p className="text-gray-400">Connect your wallet to view balance</p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-4">Wallet Balance</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Address:</span>
          <span className="text-white font-mono text-sm">
            {formatAddress(publicKey.toBase58())}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Balance:</span>
          <div className="text-right">
            {loading ? (
              <div className="animate-pulse bg-gray-700 h-6 w-16 rounded"></div>
            ) : (
              <span className="text-2xl font-bold text-solana-green">
                {balance !== null ? `${formatBalance(balance)} SOL` : 'Error'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Connected to Solana Devnet • Balance updates every 10s
        </p>
      </div>
    </div>
  );
}