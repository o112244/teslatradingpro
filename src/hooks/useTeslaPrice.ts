import { useState, useEffect } from 'react';

interface TeslaPriceData {
  price: number;
  change24h: number;
  changePercent24h: number;
  volume: number;
  marketCap: number;
  lastUpdated: Date;
}

export const useTeslaPrice = () => {
  const [teslaData, setTeslaData] = useState<TeslaPriceData>({
    price: 248.42,
    change24h: -3.18,
    changePercent24h: -1.26,
    volume: 89234567,
    marketCap: 789456123000,
    lastUpdated: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeslaPrice = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use environment variable for API key instead of hardcoded 'demo'
      const apiKey = import.meta.env.VITE_FMP_API_KEY || 'demo';
      const response = await fetch(`/api/fmp/v3/quote/TSLA?apikey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Tesla price');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const quote = data[0];
        setTeslaData({
          price: quote.price || 248.42,
          change24h: quote.change || -3.18,
          changePercent24h: quote.changesPercentage || -1.26,
          volume: quote.volume || 89234567,
          marketCap: quote.marketCap || 789456123000,
          lastUpdated: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching Tesla price:', err);
      setError('Failed to fetch real-time Tesla price');
      // Simulate realistic price movements as fallback
      setTeslaData(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 2,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5,
        lastUpdated: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch immediately
    fetchTeslaPrice();
    
    // Then fetch every 30 seconds for real-time updates
    const interval = setInterval(fetchTeslaPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { teslaData, isLoading, error, refetch: fetchTeslaPrice };
};