import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CryptoAsset, CryptoState } from '../types/crypto';

// Helper function for generating random percentage changes
const getRandomPercentChange = (min: number, max: number): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

// Mock data for our initial crypto assets
const initialMockData: CryptoAsset[] = [
  {
    id: 1,
    rank: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    price: 60134.23,
    percentChange1h: 0.75,
    percentChange24h: 2.34,
    percentChange7d: -1.23,
    marketCap: 1124821034558,
    volume24h: 32154654125,
    circulatingSupply: 18712950,
    sparklineData: [59000, 59500, 59200, 60000, 60100, 60050, 60200, 60134],
    lastUpdated: Date.now()
  },
  {
    id: 2,
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    price: 3400.85,
    percentChange1h: -0.25,
    percentChange24h: 1.56,
    percentChange7d: 3.45,
    marketCap: 407537183234,
    volume24h: 18427654321,
    circulatingSupply: 119853060,
    sparklineData: [3300, 3350, 3370, 3400, 3380, 3390, 3410, 3400],
    lastUpdated: Date.now()
  },
  {
    id: 3,
    rank: 3,
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    price: 1.00,
    percentChange1h: 0.01,
    percentChange24h: -0.02,
    percentChange7d: 0.05,
    marketCap: 83172594300,
    volume24h: 62134587923,
    circulatingSupply: 83172594300,
    sparklineData: [1.0, 1.0, 0.999, 1.001, 1.0, 0.998, 1.0, 1.0],
    lastUpdated: Date.now()
  },
  {
    id: 4,
    rank: 4,
    name: 'XRP',
    symbol: 'XRP',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    price: 0.63,
    percentChange1h: 1.23,
    percentChange24h: -0.78,
    percentChange7d: 5.43,
    marketCap: 32854321000,
    volume24h: 1854732654,
    circulatingSupply: 52134875000,
    sparklineData: [0.62, 0.63, 0.64, 0.62, 0.61, 0.62, 0.63, 0.63],
    lastUpdated: Date.now()
  },
  {
    id: 5,
    rank: 5,
    name: 'Binance Coin',
    symbol: 'BNB',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    price: 468.23,
    percentChange1h: 0.32,
    percentChange24h: 3.12,
    percentChange7d: -2.34,
    marketCap: 72354987612,
    volume24h: 2143567890,
    circulatingSupply: 154533246,
    sparklineData: [460, 465, 462, 464, 467, 470, 468, 468],
    lastUpdated: Date.now()
  },
  {
    id: 6,
    rank: 6,
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    price: 120.85,
    percentChange1h: 2.32,
    percentChange24h: 7.89,
    percentChange7d: 12.45,
    marketCap: 48234567890,
    volume24h: 3245678901,
    circulatingSupply: 398789215,
    sparklineData: [115, 117, 118, 120, 119, 121, 122, 120],
    lastUpdated: Date.now()
  }
];

const initialState: CryptoState = {
  assets: initialMockData,
  loading: false,
  error: null,
  connectionStatus: 'connected'
};

// Helper function to update sparkline data
const updateSparklineData = (data: number[], newValue: number): number[] => {
  const newData = [...data.slice(1), newValue];
  return newData;
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updatePrices: (state) => {
      state.assets = state.assets.map(asset => {
        // Generate random price changes
        const priceChangePercent = getRandomPercentChange(-2, 2) / 100;
        const newPrice = parseFloat((asset.price * (1 + priceChangePercent)).toFixed(2));
        
        // Generate random percentage changes
        const newPercentChange1h = parseFloat((asset.percentChange1h + getRandomPercentChange(-0.5, 0.5)).toFixed(2));
        const newPercentChange24h = parseFloat((asset.percentChange24h + getRandomPercentChange(-0.2, 0.2)).toFixed(2));
        const newPercentChange7d = parseFloat((asset.percentChange7d + getRandomPercentChange(-0.1, 0.1)).toFixed(2));
        
        // Update volume with random change
        const volumeChangePercent = getRandomPercentChange(-5, 5) / 100;
        const newVolume = parseFloat((asset.volume24h * (1 + volumeChangePercent)).toFixed(0));
        
        // Update market cap based on new price
        const newMarketCap = newPrice * asset.circulatingSupply;
        
        // Update sparkline data
        const newSparklineData = updateSparklineData(asset.sparklineData, newPrice);
        
        return {
          ...asset,
          price: newPrice,
          percentChange1h: newPercentChange1h,
          percentChange24h: newPercentChange24h,
          percentChange7d: newPercentChange7d,
          marketCap: newMarketCap,
          volume24h: newVolume,
          sparklineData: newSparklineData,
          lastUpdated: Date.now()
        };
      });
    },
    setConnectionStatus: (state, action: PayloadAction<'connected' | 'disconnected'>) => {
      state.connectionStatus = action.payload;
    }
  }
});

export const { updatePrices, setConnectionStatus } = cryptoSlice.actions;
export default cryptoSlice.reducer;