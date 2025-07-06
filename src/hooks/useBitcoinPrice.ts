import { useState, useEffect } from 'react';

interface BitcoinPriceData {
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: Date;
}

export const useBitcoinPrice = () => {
  const [bitcoinData, setBitcoinData] = useState<BitcoinPriceData>({
    price: 43250.50,
    change24h: 1250.30,
    changePercent24h: 2.98,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBitcoinPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Using proxied CoinGecko API for real Bitcoin price
      const response = await fetch('/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Bitcoin price');
      }
      
      const data = await response.json();
      
      if (data.bitcoin) {
        setBitcoinData({
          price: data.bitcoin.usd,
          change24h: data.bitcoin.usd * (data.bitcoin.usd_24h_change / 100),
          changePercent24h: data.bitcoin.usd_24h_change,
          lastUpdated: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching Bitcoin price:', err);
      setError('Failed to fetch real-time Bitcoin price');
      // Keep using simulated data as fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchBitcoinPrice();
    
    // Then fetch every 30 seconds
    const interval = setInterval(fetchBitcoinPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { bitcoinData, isLoading, error, refetch: fetchBitcoinPrice };
};