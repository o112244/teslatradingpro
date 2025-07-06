import React from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
  lastUpdated?: Date;
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({ isConnected, lastUpdated }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <div className="flex items-center space-x-1 text-green-400">
            <Activity className="h-4 w-4 animate-pulse" />
            <span>Live</span>
          </div>
          <Wifi className="h-4 w-4 text-green-400" />
        </>
      ) : (
        <>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Activity className="h-4 w-4" />
            <span>Polling</span>
          </div>
          <WifiOff className="h-4 w-4 text-yellow-400" />
        </>
      )}
      {lastUpdated && (
        <span className="text-gray-400">
          {formatTime(lastUpdated)}
        </span>
      )}
    </div>
  );
};

export default RealTimeIndicator;