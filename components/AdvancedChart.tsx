
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { ChartDataPoint, OHLCPoint } from '../types.ts';

interface AdvancedChartProps {
  data: (ChartDataPoint | OHLCPoint)[];
  type: 'line' | 'candlestick';
  color?: string;
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({ data, type, color = '#6366f1' }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Remove existing series before adding a new one
    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    try {
      if (type === 'candlestick') {
        const candlestickSeries = chartRef.current.addCandlestickSeries({
          upColor: '#10b981',
          downColor: '#f43f5e',
          borderVisible: false,
          wickUpColor: '#10b981',
          wickDownColor: '#f43f5e',
        });
        candlestickSeries.setData(data as any);
        seriesRef.current = candlestickSeries;
      } else {
        const areaSeries = chartRef.current.addAreaSeries({
          lineColor: color,
          topColor: `${color}33`,
          bottomColor: `${color}00`,
          lineWidth: 2,
        });
        const lineData = data.map(d => ('value' in d ? d : { time: d.time, value: (d as OHLCPoint).close }));
        areaSeries.setData(lineData);
        seriesRef.current = areaSeries;
      }
      
      chartRef.current.timeScale().fitContent();
    } catch (e) {
      console.warn("Chart data update failed:", e);
    }
  }, [data, type, color]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};

export default AdvancedChart;
