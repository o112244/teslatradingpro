import { useEffect, useState } from 'react';

interface MarketData {
  bitcoin: {
    price: number;
    change24h: number;
    changePercent24h: number;
    volume: number;
    lastUpdated: Date;
  };
  tesla: {
    price: number;
    change24h: number;
    changePercent24h: number;
    volume: number;
    marketCap: number;
    lastUpdated: Date;
  };
}

export const useRealTimeData = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    bitcoin: {
      price: 43250.50,
      change24h: 1250.30,
      changePercent24h: 2.98,
      volume: 28500000000,
      lastUpdated: new Date()
    },
    tesla: {
      price: 248.42,
      change24h: -3.18,
      changePercent24h: -1.26,
      volume: 89234567,
      marketCap: 789456123000,
      lastUpdated: new Date()
    }
  });

  const [isConnected, setIsConnected] = useState(false);

  // Disable WebSocket connection for now to avoid connection errors
  // WebSocket functionality can be enabled when a proper WebSocket server is available
  const wsUrl = null; // Temporarily disabled

  useEffect(() => {
    // Use HTTP polling as the primary data source
    const interval = setInterval(async () => {
      try {
        // Fetch Bitcoin price without API key first (free tier)
        let btcUrl = '/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';
        
        const btcResponse = await fetch(btcUrl);
        if (btcResponse.ok) {
          const btcData = await btcResponse.json();
          if (btcData.bitcoin) {
            setMarketData(prev => ({
              ...prev,
              bitcoin: {
                price: btcData.bitcoin.usd,
                change24h: btcData.bitcoin.usd * (btcData.bitcoin.usd_24h_change / 100),
                changePercent24h: btcData.bitcoin.usd_24h_change,
                volume: btcData.bitcoin.usd_24h_vol || prev.bitcoin.volume,
                lastUpdated: new Date()
              }
            }));
          }
        }

        // Fetch Tesla price with environment variable API key
        const fmpApiKey = import.meta.env.VITE_FMP_API_KEY || 'demo';
        const tslaResponse = await fetch(`/api/fmp/v3/quote/TSLA?apikey=${fmpApiKey}`);
        if (tslaResponse.ok) {
          const tslaData = await tslaResponse.json();
          if (tslaData && tslaData.length > 0) {
            const quote = tslaData[0];
            setMarketData(prev => ({
              ...prev,
              tesla: {
                price: quote.price,
                change24h: quote.change,
                changePercent24h: quote.changesPercentage,
                volume: quote.volume,
                marketCap: quote.marketCap,
                lastUpdated: new Date()
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    }, 30000); // Update every 30 seconds

    // Fetch immediately on mount
    const fetchInitialData = async () => {
      try {
        const btcResponse = await fetch('/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true');
        if (btcResponse.ok) {
          const btcData = await btcResponse.json();
          if (btcData.bitcoin) {
            setMarketData(prev => ({
              ...prev,
              bitcoin: {
                price: btcData.bitcoin.usd,
                change24h: btcData.bitcoin.usd * (btcData.bitcoin.usd_24h_change / 100),
                changePercent24h: btcData.bitcoin.usd_24h_change,
                volume: btcData.bitcoin.usd_24h_vol || prev.bitcoin.volume,
                lastUpdated: new Date()
              }
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching initial Bitcoin data:', error);
      }
    };

    fetchInitialData();

    return () => clearInterval(interval);
  }, []);

  return {
    marketData,
    isConnected: false, // Always false since WebSocket is disabled
    isRealTime: false   // Always false since we're using HTTP polling
  };
};