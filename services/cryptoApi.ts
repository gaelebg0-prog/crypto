
import { Coin, MarketHistory } from '../types';

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

export const searchCoins = async (query: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/search?query=${query}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    return { coins: [] };
  }
};
