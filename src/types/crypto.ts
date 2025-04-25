export interface CryptoAsset {
  id: number;
  rank: number;
  name: string;
  symbol: string;
  logo: string;
  price: number;
  percentChange1h: number;
  percentChange24h: number;
  percentChange7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  sparklineData: number[];
  lastUpdated: number;
  [key: string]: number | string | number[]; // Adding index signature to allow string indexing
}

export interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
  connectionStatus: 'connected' | 'disconnected';
}