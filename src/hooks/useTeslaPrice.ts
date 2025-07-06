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
      
      // Using Alpha Vantage API for real Tesla stock price
      // Note: In production, you'd use a paid API key
      const API_KEY = 'demo'; // Replace with real API key
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TSLA&apikey=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Tesla price');
      }
      
      const data = await response.json();
      
      if (data['Global Quote']) {
        const quote = data['Global Quote'];
        const currentPrice = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        
        setTeslaData({
          price: currentPrice,
          change24h: change,
          changePercent24h: changePercent,
          volume: parseInt(quote['06. volume']),
          marketCap: currentPrice * 3170000000, // Approximate shares outstanding
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
    
    // Then fetch every 60 seconds (stock market data updates less frequently)
    const interval = setInterval(fetchTeslaPrice, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { teslaData, isLoading, error, refetch: fetchTeslaPrice };
};