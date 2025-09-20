'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSendTransaction } from '../hooks/useSendTransaction';
import { getExplorerUrl } from '../utils/constants';
import { useWalletOperation } from '../contexts/ErrorContext';
import { PublicKey } from '@solana/web3.js';
import { handleWalletError, WalletErrorTypes } from '../utils/walletErrorHandler';
import toast from 'react-hot-toast';

export default function SendSOLForm() {
  const { connected, publicKey } = useWallet();
  const { sendSol, loading: sendLoading } = useSendTransaction();
  const { executeOperation } = useWalletOperation();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [lastTxSignature, setLastTxSignature] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ recipient?: string; amount?: string }>({});

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: { recipient?: string; amount?: string } = {};

    // Validate recipient address
    if (!recipient.trim()) {
      errors.recipient = 'Adresa destinatarului este obligatorie';
    } else {
      try {
        new PublicKey(recipient.trim());
      } catch {
        errors.recipient = 'Adresă Solana invalidă';
      }
    }

    // Validate amount
    if (!amount.trim()) {
      errors.amount = 'Suma este obligatorie';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        errors.amount = 'Suma trebuie să fie un număr pozitiv';
      } else if (numAmount < 0.0001) {
        errors.amount = 'Suma minimă este 0.0001 SOL';
      }
    }

    // Check if sending to self
    if (publicKey && recipient.trim() === publicKey.toBase58()) {
      errors.recipient = 'Nu poți trimite SOL către propria adresă';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Te rugăm să corectezi erorile din formular');
      return;
    }

    // Enhanced error handling with executeOperation
    const result = await executeOperation(
      async () => {
        const signature = await sendSol(recipient.trim(), parseFloat(amount));
        if (!signature) {
          throw new Error('Tranzacția a eșuat - nu s-a primit semnatura');
        }
        return signature;
      },
      'Trimitere SOL',
      {
        clearPreviousErrors: true,
        showLoading: true
      }
    );

    if (result) {
      setLastTxSignature(result);
      setRecipient('');
      setAmount('');
      setFormErrors({});
      
      toast.success(`SOL trimis cu succes! Semnatură: ${result.slice(0, 8)}...${result.slice(-8)}`, {
        duration: 6000,
      });
    }
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (formErrors.recipient) {
      setFormErrors(prev => ({ ...prev, recipient: undefined }));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (formErrors.amount) {
      setFormErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  if (!connected) {
    return (
      <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">Trimite SOL</h3>
        <div className="flex items-center space-x-3 text-gray-400">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            🔒
          </div>
          <p>Conectează-ți wallet-ul pentru a trimite SOL</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-4">Trimite SOL</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Adresa destinatarului *
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => handleRecipientChange(e.target.value)}
            placeholder="Introdu adresa Solana..."
            className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:border-transparent transition-colors ${
              formErrors.recipient 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-700'
            }`}
            disabled={sendLoading}
          />
          {formErrors.recipient && (
            <p className="mt-1 text-sm text-red-400">{formErrors.recipient}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Suma (SOL) *
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.0000"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-solana-purple focus:border-transparent transition-colors ${
              formErrors.amount 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-700'
            }`}
            disabled={sendLoading}
          />
          {formErrors.amount && (
            <p className="mt-1 text-sm text-red-400">{formErrors.amount}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={sendLoading || !recipient.trim() || !amount.trim()}
          className="w-full bg-solana-purple hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {sendLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Se trimite...</span>
            </div>
          ) : (
            'Trimite SOL'
          )}
        </button>
      </form>
      
      {lastTxSignature && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-400">✓</span>
            <p className="text-sm font-medium text-green-400">Tranzacție finalizată</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Semnatura tranzacției:</p>
            <a
              href={getExplorerUrl(lastTxSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-solana-green hover:text-green-400 text-sm font-mono bg-gray-800 px-3 py-2 rounded border hover:border-green-600 transition-colors"
            >
              {lastTxSignature.slice(0, 12)}...{lastTxSignature.slice(-12)}
              <span className="ml-2 text-xs text-gray-400">↗</span>
            </a>
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>ℹ️</span>
          <p>Tranzacțiile sunt procesate pe Solana Devnet • Comisionul este foarte mic</p>
        </div>
      </div>
    </div>
  );
}