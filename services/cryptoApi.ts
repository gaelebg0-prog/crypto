
import { Coin, MarketHistory, OHLCPoint } from '../types.ts';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (perPage = 50): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
    );
    if (!response.ok) throw new Error('Failed to fetch coins');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return [];
  }
};

export const fetchCoinHistory = async (coinId: string, days: number = 7): Promise<MarketHistory | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    return null;
  }
};

export const fetchCoinOHLC = async (coinId: string, days: number = 7): Promise<OHLCPoint[]> => {
  try {
    // Note: CoinGecko limit OHLC days options to 1, 7, 14, 30, 90, 180, 365
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch OHLC');
    const data: [number, number, number, number, number][] = await response.json();
    return data.map(([time, open, high, low, close]) => ({
      time: time / 1000, // lightweight-charts expects seconds
      open,
      high,
      low,
      close
    }));
  } catch (error) {
    console.error(`Error fetching OHLC for ${coinId}:`, error);
    return [];
  }
};
