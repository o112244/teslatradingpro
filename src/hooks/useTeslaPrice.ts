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

  const simulateRealisticStockMovement = () => {
    setTeslaData(prev => {
      // Simulate realistic Tesla stock movements
      const volatility = 0.015; // 1.5% max change per update (stocks are less volatile than crypto)
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const newPrice = prev.price * (1 + randomChange);
      
      // Calculate 24h change based on the movement
      const change24h = newPrice - prev.price + prev.change24h * 0.9; // Decay previous change
      const changePercent24h = (change24h / (newPrice - change24h)) * 100;
      
      // Simulate volume changes
      const volumeChange = (Math.random() - 0.5) * 0.1; // 10% max volume change
      const newVolume = Math.max(prev.volume * (1 + volumeChange), 10000000);
      
      // Update market cap based on new price (approximate shares outstanding: 3.17B)
      const sharesOutstanding = 3170000000;
      const newMarketCap = newPrice * sharesOutstanding;
      
      return {
        price: Math.max(newPrice, 50), // Minimum price floor
        change24h,
        changePercent24h,
        volume: Math.round(newVolume),
        marketCap: Math.round(newMarketCap),
        lastUpdated: new Date()
      };
    });
  };

  useEffect(() => {
    // Simulate price updates every 60 seconds (stock market data updates less frequently)
    const interval = setInterval(simulateRealisticStockMovement, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate a brief loading state
    setTimeout(() => {
      simulateRealisticStockMovement();
      setIsLoading(false);
    }, 500);
  };

  return { teslaData, isLoading, error, refetch };
};