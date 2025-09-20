import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function useBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    const getBalance = async () => {
      setLoading(true);
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    getBalance();
    
    // Update balance every 10 seconds
    const interval = setInterval(getBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return { balance, loading };
}