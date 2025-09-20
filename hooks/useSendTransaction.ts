import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export function useSendTransaction() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const sendSol = useCallback(
    async (recipientAddress: string, amount: number) => {
      if (!publicKey) {
        toast.error('Wallet not connected');
        return null;
      }

      setLoading(true);
      
      try {
        const toPublicKey = new PublicKey(recipientAddress);
        const lamports = amount * LAMPORTS_PER_SOL;

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: toPublicKey,
            lamports,
          })
        );

        const signature = await sendTransaction(transaction, connection);
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        
        toast.success(`Transaction successful! Signature: ${signature.slice(0, 8)}...`);
        return signature;
      } catch (error: any) {
        console.error('Transaction failed:', error);
        toast.error(`Transaction failed: ${error.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [publicKey, sendTransaction, connection]
  );

  return { sendSol, loading };
}