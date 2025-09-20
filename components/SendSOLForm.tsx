'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSendTransaction } from '../hooks/useSendTransaction';
import { getExplorerUrl } from '../utils/constants';

export default function SendSOLForm() {
  const { connected } = useWallet();
  const { sendSol, loading } = useSendTransaction();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !amount) {
      return;
    }

    const signature = await sendSol(recipient, parseFloat(amount));
    if (signature) {
      setLastTxSignature(signature);
      setRecipient('');
      setAmount('');
    }
  };

  if (!connected) {
    return (
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Send SOL</h3>
        <p className="text-gray-400">Connect your wallet to send SOL</p>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-4">Send SOL</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter Solana address..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Amount (SOL)
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0000"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !recipient || !amount}
          className="w-full bg-solana-purple hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Sending...' : 'Send SOL'}
        </button>
      </form>
      
      {lastTxSignature && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-400 mb-2">Last Transaction:</p>
          <a
            href={getExplorerUrl(lastTxSignature)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-solana-green hover:text-green-400 text-sm font-mono underline"
          >
            {lastTxSignature.slice(0, 8)}...{lastTxSignature.slice(-8)}
          </a>
        </div>
      )}
    </div>
  );
}