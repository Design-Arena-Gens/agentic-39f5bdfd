'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface PriceData {
  time: string;
  price: number;
  sma20: number;
  sma50: number;
  rsi: number;
  volume: number;
}

interface Analysis {
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  signal: 'BUY' | 'SELL' | 'HOLD';
  strength: number;
  support: number;
  resistance: number;
  rsi: number;
  macdSignal: string;
}

export default function ForexGoldAnalysis() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(2050);
  const [analysis, setAnalysis] = useState<Analysis>({
    trend: 'BULLISH',
    signal: 'HOLD',
    strength: 65,
    support: 2045,
    resistance: 2060,
    rsi: 58,
    macdSignal: 'Netral'
  });

  // Generate realistic forex gold price data
  const generatePriceData = () => {
    const basePrice = 2050;
    const data: PriceData[] = [];
    let price = basePrice;

    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.48) * 5; // Slight bullish bias
      price += change;

      const time = new Date(Date.now() - (50 - i) * 300000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      data.push({
        time,
        price: parseFloat(price.toFixed(2)),
        sma20: parseFloat((price - (Math.random() * 2 - 1)).toFixed(2)),
        sma50: parseFloat((price - (Math.random() * 4 - 2)).toFixed(2)),
        rsi: parseFloat((50 + Math.random() * 30 - 10).toFixed(1)),
        volume: Math.floor(Math.random() * 5000 + 2000)
      });
    }

    return data;
  };

  // Calculate technical analysis
  const calculateAnalysis = (data: PriceData[]): Analysis => {
    if (data.length < 2) return analysis;

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    const priceTrend = latest.price - previous.price;

    // Calculate RSI
    const rsi = latest.rsi;

    // Determine trend
    let trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' = 'SIDEWAYS';
    if (latest.price > latest.sma20 && latest.sma20 > latest.sma50) {
      trend = 'BULLISH';
    } else if (latest.price < latest.sma20 && latest.sma20 < latest.sma50) {
      trend = 'BEARISH';
    }

    // Determine signal
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (rsi < 30 && priceTrend > 0) {
      signal = 'BUY';
    } else if (rsi > 70 && priceTrend < 0) {
      signal = 'SELL';
    } else if (trend === 'BULLISH' && rsi > 40 && rsi < 60) {
      signal = 'BUY';
    } else if (trend === 'BEARISH' && rsi > 50 && rsi < 70) {
      signal = 'SELL';
    }

    // Calculate strength
    const strength = Math.min(100, Math.abs(latest.price - latest.sma50) / latest.sma50 * 1000 + rsi * 0.5);

    // Calculate support and resistance
    const prices = data.slice(-20).map(d => d.price);
    const support = Math.min(...prices);
    const resistance = Math.max(...prices);

    // MACD signal
    let macdSignal = 'Netral';
    if (trend === 'BULLISH' && priceTrend > 0) {
      macdSignal = 'Bullish Cross';
    } else if (trend === 'BEARISH' && priceTrend < 0) {
      macdSignal = 'Bearish Cross';
    }

    return {
      trend,
      signal,
      strength: parseFloat(strength.toFixed(1)),
      support: parseFloat(support.toFixed(2)),
      resistance: parseFloat(resistance.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(1)),
      macdSignal
    };
  };

  // Initialize and update data
  useEffect(() => {
    const initialData = generatePriceData();
    setPriceData(initialData);
    setCurrentPrice(initialData[initialData.length - 1].price);
    setAnalysis(calculateAnalysis(initialData));

    const interval = setInterval(() => {
      setPriceData(prevData => {
        const lastPrice = prevData[prevData.length - 1].price;
        const change = (Math.random() - 0.48) * 2;
        const newPrice = parseFloat((lastPrice + change).toFixed(2));

        const newDataPoint: PriceData = {
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          price: newPrice,
          sma20: parseFloat((newPrice - (Math.random() * 2 - 1)).toFixed(2)),
          sma50: parseFloat((newPrice - (Math.random() * 4 - 2)).toFixed(2)),
          rsi: parseFloat((50 + Math.random() * 30 - 10).toFixed(1)),
          volume: Math.floor(Math.random() * 5000 + 2000)
        };

        const updatedData = [...prevData.slice(1), newDataPoint];
        setCurrentPrice(newPrice);
        setAnalysis(calculateAnalysis(updatedData));

        return updatedData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const priceChange = priceData.length > 1 ? currentPrice - priceData[priceData.length - 2].price : 0;
  const priceChangePercent = priceData.length > 1 ? (priceChange / priceData[priceData.length - 2].price * 100) : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Analisa Trading Forex Gold</h1>
              <p className="text-gray-600">XAU/USD - Real-time Technical Analysis</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-800">${currentPrice.toFixed(2)}</div>
              <div className={`text-lg font-semibold flex items-center justify-end gap-2 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Trend</span>
              <Activity className="text-blue-500" />
            </div>
            <div className={`text-2xl font-bold ${analysis.trend === 'BULLISH' ? 'text-green-600' : analysis.trend === 'BEARISH' ? 'text-red-600' : 'text-yellow-600'}`}>
              {analysis.trend}
            </div>
            <div className="text-sm text-gray-500 mt-1">Kekuatan: {analysis.strength}%</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Sinyal</span>
              {analysis.signal === 'BUY' ? <ArrowUpCircle className="text-green-500" /> : analysis.signal === 'SELL' ? <ArrowDownCircle className="text-red-500" /> : <AlertCircle className="text-yellow-500" />}
            </div>
            <div className={`text-2xl font-bold ${analysis.signal === 'BUY' ? 'text-green-600' : analysis.signal === 'SELL' ? 'text-red-600' : 'text-yellow-600'}`}>
              {analysis.signal}
            </div>
            <div className="text-sm text-gray-500 mt-1">MACD: {analysis.macdSignal}</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">RSI</span>
              <Activity className="text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{analysis.rsi}</div>
            <div className="text-sm text-gray-500 mt-1">
              {analysis.rsi < 30 ? 'Oversold' : analysis.rsi > 70 ? 'Overbought' : 'Normal'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Support/Resistance</span>
              <DollarSign className="text-orange-500" />
            </div>
            <div className="text-lg font-bold text-green-600">${analysis.support.toFixed(2)}</div>
            <div className="text-lg font-bold text-red-600">${analysis.resistance.toFixed(2)}</div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Grafik Harga & Moving Averages</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} name="Harga" dot={false} />
              <Line type="monotone" dataKey="sma20" stroke="#10b981" strokeWidth={2} name="SMA 20" dot={false} />
              <Line type="monotone" dataKey="sma50" stroke="#f59e0b" strokeWidth={2} name="SMA 50" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RSI Chart */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Relative Strength Index (RSI)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="rsi" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="RSI" />
              <Line y={70} stroke="#ef4444" strokeDasharray="5 5" />
              <Line y={30} stroke="#10b981" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trading Recommendations */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Rekomendasi Trading</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">Analisis Teknikal</h3>
              <p className="text-gray-600">
                Trend saat ini menunjukkan kondisi <span className="font-bold">{analysis.trend}</span> dengan kekuatan {analysis.strength}%.
                {analysis.signal === 'BUY' && ' Sinyal BUY terdeteksi - pertimbangkan entry posisi long dengan stop loss di bawah support.'}
                {analysis.signal === 'SELL' && ' Sinyal SELL terdeteksi - pertimbangkan entry posisi short dengan stop loss di atas resistance.'}
                {analysis.signal === 'HOLD' && ' Sinyal HOLD - tunggu konfirmasi lebih lanjut sebelum entry.'}
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">Level Penting</h3>
              <p className="text-gray-600">
                Support kuat di <span className="font-bold text-green-600">${analysis.support.toFixed(2)}</span> dan
                Resistance di <span className="font-bold text-red-600">${analysis.resistance.toFixed(2)}</span>.
                Gunakan level ini untuk menentukan stop loss dan take profit.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="font-semibold text-gray-800">Indikator RSI</h3>
              <p className="text-gray-600">
                RSI saat ini di level {analysis.rsi}.
                {analysis.rsi < 30 && ' Kondisi oversold - kemungkinan reversal bullish.'}
                {analysis.rsi > 70 && ' Kondisi overbought - kemungkinan reversal bearish.'}
                {analysis.rsi >= 30 && analysis.rsi <= 70 && ' RSI dalam kondisi normal - ikuti trend yang ada.'}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-yellow-600 mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-yellow-800">Disclaimer</h3>
                  <p className="text-sm text-yellow-700">
                    Analisis ini hanya untuk tujuan edukasi. Trading forex melibatkan risiko tinggi.
                    Selalu gunakan manajemen risiko yang baik dan jangan trading dengan uang yang tidak mampu Anda rugikan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
