'use client';

import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export default function NetworkStatus() {
  const { connection } = useConnection();
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [tps, setTps] = useState<number | null>(null);

  useEffect(() => {
    const updateNetworkInfo = async () => {
      try {
        const slot = await connection.getSlot();
        setBlockHeight(slot);
        
        const performanceSamples = await connection.getRecentPerformanceSamples(1);
        if (performanceSamples.length > 0) {
          const sample = performanceSamples[0];
          const calculatedTps = sample.numTransactions / sample.samplePeriodSecs;
          setTps(Math.round(calculatedTps));
        }
      } catch (error) {
        console.error('Error fetching network info:', error);
      }
    };

    updateNetworkInfo();
    const interval = setInterval(updateNetworkInfo, 5000);
    
    return () => clearInterval(interval);
  }, [connection]);

  return (
    <div className="bg-card-bg rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-4">Network Status</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Network:</span>
          <span className="text-yellow-400 font-semibold">Devnet</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Block Height:</span>
          <span className="text-white font-mono">
            {blockHeight !== null ? blockHeight.toLocaleString() : 'Loading...'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">TPS:</span>
          <span className="text-solana-green font-semibold">
            {tps !== null ? `${tps}` : 'Loading...'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Status:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}