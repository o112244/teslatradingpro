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

  const simulateRealisticPriceMovement = () => {
    setBitcoinData(prev => {
      // Simulate realistic Bitcoin price movements
      const volatility = 0.02; // 2% max change per update
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const newPrice = prev.price * (1 + randomChange);
      
      // Calculate 24h change based on the movement
      const change24h = newPrice - prev.price + prev.change24h * 0.95; // Decay previous change
      const changePercent24h = (change24h / (newPrice - change24h)) * 100;
      
      return {
        price: Math.max(newPrice, 20000), // Minimum price floor
        change24h,
        changePercent24h,
        lastUpdated: new Date()
      };
    });
  };

  useEffect(() => {
    // Simulate price updates every 30 seconds
    const interval = setInterval(simulateRealisticPriceMovement, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate a brief loading state
    setTimeout(() => {
      simulateRealisticPriceMovement();
      setIsLoading(false);
    }, 500);
  };

  return { bitcoinData, isLoading, error, refetch };
};