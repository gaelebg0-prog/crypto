
import { GoogleGenAI } from "@google/genai";
import { Coin } from "../types";

export const getMarketAnalysis = async (coin: Coin): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const prompt = `
      Perform a professional financial analysis for ${coin.name} (${coin.symbol.toUpperCase()}).
      Current Stats:
      - Price: $${coin.current_price}
      - 24h Change: ${coin.price_change_percentage_24h}%
      - Market Cap: $${coin.market_cap.toLocaleString()}
      - All Time High: $${coin.ath}
      - All Time Low: $${coin.atl}

      Provide a concise 3-paragraph analysis covering:
      1. Recent price action and market sentiment.
      2. Fundamental value proposition.
      3. Potential risks and growth catalysts.
      
      Output in Markdown. Keep it professional and objective.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Analysis unavailable at this moment.";
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return "Error generating AI analysis. Please try again later.";
  }
};
