
import React, { useEffect, useState, useMemo } from 'react';
import { Coin } from './types.ts';
import { fetchTopCoins } from './services/cryptoApi.ts';
import CryptoDetail from './components/CryptoDetail.tsx';

const App: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  useEffect(() => {
    const loadCoins = async () => {
      setLoading(true);
      const data = await fetchTopCoins(100);
      setCoins(data);
      setLoading(false);
    };
    loadCoins();
  }, []);

  const filteredCoins = useMemo(() => {
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coins, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Crypto<span className="text-indigo-400">Pulse</span> <span className="text-xs font-light text-gray-500 uppercase">Elite</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Market</a>
            <a href="#" className="hover:text-white transition-colors">Exchanges</a>
            <a href="#" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#" className="hover:text-white transition-colors">News</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm w-48 md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 py-12">
        <div className="glass-panel p-8 md:p-12 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -z-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] -z-10 rounded-full"></div>
          
          <div className="flex-1 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Track the World's <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Cryptocurrency Markets</span>
            </h2>
            <p className="text-gray-400 max-w-lg text-lg">
              Get real-time data, professional charts, and AI-powered insights on over 10,000 digital assets. Your window into the future of finance.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Get Started</button>
              <button className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-full font-bold transition-all active:scale-95">Watchlist</button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 w-1/3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl animate-pulse">
                <div className="w-8 h-8 bg-white/10 rounded-full mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                <div className="h-2 bg-white/5 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Market Table */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Today's Market Prices</h3>
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live</span>
            <span>• Updated 1m ago</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-white/5 overflow-x-auto">
          {loading ? (
            <div className="p-20 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-sm">
                  <th className="px-6 py-4 font-medium uppercase tracking-wider w-16">#</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Price</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">24h %</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right hidden lg:table-cell">Market Cap</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right hidden lg:table-cell">Volume (24h)</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCoins.map((coin) => {
                  const change24h = coin.price_change_percentage_24h ?? 0;
                  return (
                    <tr 
                      key={coin.id} 
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      onClick={() => setSelectedCoin(coin)}
                    >
                      <td className="px-6 py-5 text-sm text-gray-500">{coin.market_cap_rank}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-bold group-hover:text-indigo-400 transition-colors">{coin.name}</p>
                            <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono font-medium">
                        ${(coin.current_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-5 text-right font-bold ${change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%
                      </td>
                      <td className="px-6 py-5 text-right text-gray-400 text-sm hidden lg:table-cell">
                        ${(coin.market_cap ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-right text-gray-400 text-sm hidden lg:table-cell">
                        ${(coin.total_volume ?? 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all border border-indigo-500/20">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 mt-20 pt-12 border-t border-white/5 text-gray-600 text-sm text-center">
        <div className="flex justify-center gap-8 mb-6">
          <a href="#" className="hover:text-gray-400">Terms</a>
          <a href="#" className="hover:text-gray-400">Privacy</a>
          <a href="#" className="hover:text-gray-400">Cookies</a>
          <a href="#" className="hover:text-gray-400">Support</a>
        </div>
        <p>© 2024 CryptoPulse Elite. Data powered by CoinGecko API. Analysis by Gemini AI.</p>
      </footer>

      {/* Selected Coin Modal */}
      {selectedCoin && (
        <CryptoDetail 
          coin={selectedCoin} 
          onClose={() => setSelectedCoin(null)} 
        />
      )}
    </div>
  );
};

export default App;
