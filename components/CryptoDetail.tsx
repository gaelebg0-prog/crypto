
import React, { useEffect, useState } from 'react';
import { Coin, ChartDataPoint, OHLCPoint } from '../types.ts';
import { fetchCoinHistory, fetchCoinOHLC } from '../services/cryptoApi.ts';
import { getMarketAnalysis } from '../services/geminiService.ts';
import AdvancedChart from './AdvancedChart.tsx';

interface CryptoDetailProps {
  coin: Coin;
  onClose: () => void;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({ coin, onClose }) => {
  const [data, setData] = useState<(ChartDataPoint | OHLCPoint)[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeRange, setActiveRange] = useState(7);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let historyData;
        if (chartType === 'candlestick') {
          historyData = await fetchCoinOHLC(coin.id, activeRange);
        } else {
          const rawHistory = await fetchCoinHistory(coin.id, activeRange);
          historyData = rawHistory?.prices.map(([timestamp, price]) => ({
            time: timestamp / 1000,
            value: price
          })) || [];
        }

        const aiReport = await getMarketAnalysis(coin);
        setData(historyData);
        setAnalysis(aiReport);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [coin, activeRange, chartType]);

  const buyLink = `https://www.binance.com/en/trade/${coin.symbol.toUpperCase()}_USDT`;
  const sellLink = `https://www.coinbase.com/price/${coin.id}`;

  const change24h = coin.price_change_percentage_24h ?? 0;
  const currentPrice = coin.current_price ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-6xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl border-indigo-500/20">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <img src={coin.image} alt={coin.name} className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {coin.name} <span className="text-gray-500 text-sm uppercase tracking-widest">{coin.symbol}</span>
              </h2>
              <p className="text-gray-400 text-xs">Market Rank #{coin.market_cap_rank}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-full transition-all hover:rotate-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-3 p-6 border-r border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Live Price</p>
                <div className="flex items-center gap-4">
                  <h3 className="text-5xl font-black text-white">${currentPrice.toLocaleString()}</h3>
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1 ${change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {change24h >= 0 ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center bg-gray-900/50 p-1.5 rounded-xl border border-white/5">
                <div className="flex gap-1 border-r border-white/10 pr-4 mr-2">
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                    title="Ligne"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  </button>
                  <button
                    onClick={() => setChartType('candlestick')}
                    className={`p-2 rounded-lg transition-all ${chartType === 'candlestick' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/5'}`}
                    title="Bougies"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </button>
                </div>
                <div className="flex gap-1">
                  {[1, 7, 30, 90, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => setActiveRange(days)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeRange === days ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {days === 1 ? '1D' : days === 7 ? '7D' : days === 30 ? '1M' : days === 90 ? '3M' : '1Y'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative min-h-[400px]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <span className="text-gray-500 text-sm animate-pulse">Analysing market data...</span>
                  </div>
                </div>
              ) : (
                <AdvancedChart data={data} type={chartType} color={change24h >= 0 ? '#10b981' : '#f43f5e'} />
              )}
            </div>

            <div className="mt-12">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                AI Intelligence Report
              </h4>
              <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 rounded-2xl p-6 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                {analysis || "Our AI model is crunching the latest market movements for " + coin.name + "..."}
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-950/40">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Performance Data</h4>
            <div className="space-y-8">
              <StatItem label="Market Cap" value={`$${(coin.market_cap ?? 0).toLocaleString()}`} />
              <StatItem label="24h Range" value={`$${(coin.low_24h ?? 0).toLocaleString()} - $${(coin.high_24h ?? 0).toLocaleString()}`} />
              <StatItem label="All Time High" value={`$${(coin.ath ?? 0).toLocaleString()}`} subLabel={`Off by ${((1 - (coin.current_price / coin.ath)) * 100).toFixed(1)}%`} />
              <StatItem label="All Time Low" value={`$${(coin.atl ?? 0).toLocaleString()}`} subLabel={`Gain of ${((coin.current_price / coin.atl) * 100).toFixed(0)}%`} />
              <StatItem label="Volume" value={`$${(coin.total_volume ?? 0).toLocaleString()}`} />
            </div>

            <div className="mt-12 space-y-4">
              <a 
                href={buyLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.97]"
              >
                Trade {coin.symbol.toUpperCase()}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <a 
                href={sellLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full py-5 border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-center font-bold rounded-2xl transition-all"
              >
                On-chain Details
              </a>
              <div className="pt-8 text-center">
                 <span className="inline-block px-3 py-1 bg-white/5 text-[9px] font-bold text-gray-500 rounded-full border border-white/5">
                   VERIFIED BY COINGECKO
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value, subLabel }: { label: string; value: string; subLabel?: string }) => (
  <div className="group">
    <p className="text-gray-500 text-[10px] mb-1 font-bold uppercase tracking-widest group-hover:text-indigo-400 transition-colors">{label}</p>
    <p className="text-xl font-mono font-medium text-white truncate">{value}</p>
    {subLabel && <p className="text-indigo-500/60 text-[10px] font-bold mt-1">{subLabel}</p>}
  </div>
);

export default CryptoDetail;
