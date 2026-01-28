
import React, { useEffect, useState } from 'react';
import { Coin, ChartDataPoint } from '../types.ts';
import { fetchCoinHistory } from '../services/cryptoApi.ts';
import { getMarketAnalysis } from '../services/geminiService.ts';
import CryptoChart from './CryptoChart.tsx';

interface CryptoDetailProps {
  coin: Coin;
  onClose: () => void;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({ coin, onClose }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState(7);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [history, aiReport] = await Promise.all([
        fetchCoinHistory(coin.id, activeRange),
        getMarketAnalysis(coin)
      ]);

      if (history) {
        const formatted = history.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          price
        }));
        setChartData(formatted);
      }
      setAnalysis(aiReport);
      setLoading(false);
    };

    loadData();
  }, [coin, activeRange]);

  const buyLink = `https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT`;
  const sellLink = `https://www.coinbase.com/price/${coin.id}`;

  const change24h = coin.price_change_percentage_24h ?? 0;
  const currentPrice = coin.current_price ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {coin.name} <span className="text-gray-500 text-sm uppercase">{coin.symbol}</span>
              </h2>
              <p className="text-gray-400 text-sm">Rank #{coin.market_cap_rank}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 p-6 border-r border-white/10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Current Price</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-4xl font-extrabold">${currentPrice.toLocaleString()}</h3>
                  <span className={`px-2 py-1 rounded text-sm font-bold ${change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 7, 30, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setActiveRange(days)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${activeRange === days ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {days === 1 ? '1D' : days === 7 ? '7D' : days === 30 ? '1M' : '3M'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <CryptoChart data={chartData} color={change24h >= 0 ? '#10b981' : '#f43f5e'} />
            )}

            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Market Analysis
              </h4>
              <div className="bg-white/5 rounded-xl p-5 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                {analysis || "Generating analysis..."}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="p-6 bg-black/20">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Market Statistics</h4>
            <div className="space-y-6">
              <StatItem label="Market Cap" value={`$${(coin.market_cap ?? 0).toLocaleString()}`} />
              <StatItem label="24h High" value={`$${(coin.high_24h ?? 0).toLocaleString()}`} />
              <StatItem label="24h Low" value={`$${(coin.low_24h ?? 0).toLocaleString()}`} />
              <StatItem label="All Time High" value={`$${(coin.ath ?? 0).toLocaleString()}`} subLabel={`ATH Date: ${new Date(coin.last_updated).toLocaleDateString()}`} />
              <StatItem label="All Time Low" value={`$${(coin.atl ?? 0).toLocaleString()}`} />
              <StatItem label="Total Volume" value={`$${(coin.total_volume ?? 0).toLocaleString()}`} />
            </div>

            <div className="mt-10 space-y-3">
              <a 
                href={buyLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
              >
                Trade on Binance
              </a>
              <a 
                href={sellLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-4 bg-white hover:bg-gray-100 text-black text-center font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                View on Coinbase
              </a>
              <p className="text-[10px] text-center text-gray-500 mt-4 px-4">
                CryptoPulse Elite is a data aggregator. Always do your own research before trading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, subLabel }: { label: string; value: string; subLabel?: string }) => (
  <div>
    <p className="text-gray-500 text-xs mb-1 uppercase tracking-tighter">{label}</p>
    <p className="text-lg font-mono font-medium text-white">{value}</p>
    {subLabel && <p className="text-gray-600 text-[10px]">{subLabel}</p>}
  </div>
);

export default CryptoDetail;
