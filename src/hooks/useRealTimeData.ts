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
  const [error, setError] = useState<string | null>(null);

  // Simulate realistic price movements
  const simulateMarketMovement = () => {
    setMarketData(prev => {
      // Bitcoin simulation
      const btcVolatility = 0.02;
      const btcChange = (Math.random() - 0.5) * 2 * btcVolatility;
      const newBtcPrice = Math.max(prev.bitcoin.price * (1 + btcChange), 20000);
      
      // Tesla simulation
      const tslaVolatility = 0.015;
      const tslaChange = (Math.random() - 0.5) * 2 * tslaVolatility;
      const newTslaPrice = Math.max(prev.tesla.price * (1 + tslaChange), 50);
      
      return {
        bitcoin: {
          ...prev.bitcoin,
          price: newBtcPrice,
          change24h: newBtcPrice - prev.bitcoin.price + prev.bitcoin.change24h * 0.95,
          changePercent24h: ((newBtcPrice - prev.bitcoin.price) / prev.bitcoin.price) * 100,
          lastUpdated: new Date()
        },
        tesla: {
          ...prev.tesla,
          price: newTslaPrice,
          change24h: newTslaPrice - prev.tesla.price + prev.tesla.change24h * 0.9,
          changePercent24h: ((newTslaPrice - prev.tesla.price) / prev.tesla.price) * 100,
          lastUpdated: new Date()
        }
      };
    });
  };

  useEffect(() => {
    // Start with simulated data and attempt to fetch real data
    const interval = setInterval(async () => {
      try {
        setError(null);
        // Fetch Bitcoin price with API key if available for authenticated requests
        const coinGeckoApiKey = import.meta.env.VITE_COINGECKO_API_KEY;
        let btcUrl = '/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';
        
        if (coinGeckoApiKey) {
          btcUrl += `&x_cg_pro_api_key=${coinGeckoApiKey}`;
        }
        
        try {
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
              setIsConnected(true);
            }
          } else {
            throw new Error('Failed to fetch Bitcoin data');
          }
        } catch (btcError) {
          console.warn('Bitcoin API unavailable, using simulated data');
          setIsConnected(false);
        }

        try {
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
          } else {
            throw new Error('Failed to fetch Tesla data');
          }
        } catch (tslaError) {
          console.warn('Tesla API unavailable, using simulated data');
        }
        
        // If APIs fail, use simulated data
        if (!isConnected) {
          simulateMarketMovement();
        }
      } catch (error) {
        console.warn('Market data APIs unavailable, using simulated data');
        setError('Using simulated market data');
        setIsConnected(false);
        simulateMarketMovement();
      }
    }, 30000); // Update every 30 seconds

    // Initial data fetch
    const fetchInitialData = async () => {
      try {
        setError(null);
        const coinGeckoApiKey = import.meta.env.VITE_COINGECKO_API_KEY;
        let btcUrl = '/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';
        
        if (coinGeckoApiKey) {
          btcUrl += `&x_cg_pro_api_key=${coinGeckoApiKey}`;
        }
        
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
            setIsConnected(true);
          }
        } else {
          throw new Error('Initial Bitcoin fetch failed');
        }
      } catch (error) {
        console.warn('Initial data fetch failed, using simulated data');
        setError('Using simulated market data');
        setIsConnected(false);
        simulateMarketMovement();
      }
    };

    fetchInitialData();
    
    // Start simulation interval as backup
    const simulationInterval = setInterval(simulateMarketMovement, 45000);

    return () => {
      clearInterval(interval);
      clearInterval(simulationInterval);
    };
  }, []);

  return {
    marketData,
    isConnected,
    isRealTime: isConnected,
    error
  };
};