import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';

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

  // Use ws:// instead of wss:// for localhost to avoid TLS handshake issues
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';

  const { isConnected: wsConnected, sendMessage } = useWebSocket(wsUrl, {
    onMessage: (message) => {
      switch (message.type) {
        case 'MARKET_UPDATE':
          setMarketData(prev => ({
            ...prev,
            ...message.data,
            bitcoin: {
              ...prev.bitcoin,
              ...message.data.bitcoin,
              lastUpdated: new Date()
            },
            tesla: {
              ...prev.tesla,
              ...message.data.tesla,
              lastUpdated: new Date()
            }
          }));
          break;
        case 'BITCOIN_PRICE':
          setMarketData(prev => ({
            ...prev,
            bitcoin: {
              ...prev.bitcoin,
              ...message.data,
              lastUpdated: new Date()
            }
          }));
          break;
        case 'TESLA_PRICE':
          setMarketData(prev => ({
            ...prev,
            tesla: {
              ...prev.tesla,
              ...message.data,
              lastUpdated: new Date()
            }
          }));
          break;
      }
    },
    onConnect: () => {
      setIsConnected(true);
      // Subscribe to market data updates
      sendMessage({
        type: 'SUBSCRIBE',
        channels: ['bitcoin_price', 'tesla_price', 'market_updates']
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
    }
  });

  useEffect(() => {
    setIsConnected(wsConnected);
  }, [wsConnected]);

  // Fallback to HTTP polling if WebSocket is not available
  useEffect(() => {
    if (!isConnected) {
      const interval = setInterval(async () => {
        try {
          // Fetch Bitcoin price with optional API key
          const coinGeckoApiKey = import.meta.env.VITE_COINGECKO_API_KEY;
          let btcUrl = '/api/coingecko/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';
          
          if (coinGeckoApiKey) {
            btcUrl += `&x_cg_api_key=${coinGeckoApiKey}`;
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
                  volume: btcData.bitcoin.usd_24h_vol,
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

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return {
    marketData,
    isConnected,
    isRealTime: isConnected
  };
};