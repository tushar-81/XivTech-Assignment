import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../app/store';
import { updatePrices } from '../features/cryptoSlice';

// Sort options for table columns
type SortKey = 'rank' | 'price' | 'percentChange1h' | 'percentChange24h' | 'percentChange7d' | 'marketCap' | 'volume24h';
type SortDirection = 'asc' | 'desc';

// Filter options
type FilterOption = 'all' | 'topGainers' | 'topLosers';

// Local storage keys
const STORAGE_KEY_SORT = 'crypto_sort_key';
const STORAGE_KEY_DIRECTION = 'crypto_sort_direction';
const STORAGE_KEY_FILTER = 'crypto_filter_option';

const CryptoTable: React.FC = () => {
  const dispatch = useDispatch();
  const { assets } = useSelector((state: RootState) => state.crypto);
  const [prevValues, setPrevValues] = useState<Record<string, Record<string, number>>>({});
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  
  // Initialize state with values from localStorage or defaults
  const [sortKey, setSortKey] = useState<SortKey>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SORT);
    return (saved as SortKey) || 'rank';
  });
  
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DIRECTION);
    return (saved as SortDirection) || 'asc';
  });
  
  const [filterOption, setFilterOption] = useState<FilterOption>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FILTER);
    return (saved as FilterOption) || 'all';
  });

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SORT, sortKey);
  }, [sortKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DIRECTION, sortDirection);
  }, [sortDirection]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILTER, filterOption);
  }, [filterOption]);

  // Set up interval for price updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updatePrices());
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Filter the assets based on the current filter option
  const filteredAssets = assets.filter((asset) => {
    if (filterOption === 'all') return true;
    if (filterOption === 'topGainers') return asset.percentChange24h > 0;
    if (filterOption === 'topLosers') return asset.percentChange24h < 0;
    return true;
  });

  // Sort the assets based on current sort settings
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    let aValue: number = a[sortKey];
    let bValue: number = b[sortKey];
    
    if (sortDirection === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  // Handle sort change
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle direction if same key is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to descending for most values (except rank)
      setSortKey(key);
      setSortDirection(key === 'rank' ? 'asc' : 'desc');
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterOption) => {
    setFilterOption(filter);
  };

  // Get sort icon/indicator
  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    
    return (
      <span className="ml-1 inline-block">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  // Track previous values for animation
  useEffect(() => {
    const newPrevValues: Record<string, Record<string, number>> = {};
    
    assets.forEach(asset => {
      newPrevValues[asset.id] = {
        price: asset.price,
        percentChange1h: asset.percentChange1h,
        percentChange24h: asset.percentChange24h,
        percentChange7d: asset.percentChange7d,
        volume24h: asset.volume24h
      };
    });
    
    setPrevValues(newPrevValues);
  }, [assets]);

  // Check for mobile/desktop size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Format currency values
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 6 : 2
    }).format(num);
  };

  // Check if a value has changed
  const hasValueChanged = (assetId: number, key: string): boolean => {
    if (!prevValues[assetId]) return false;
    return prevValues[assetId][key] !== assets.find(a => a.id === assetId)?.[key];
  };

  // Generate a simple sparkline SVG
  const generateSparkline = (data: number[]): string => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Normalize data to 0-30 range for height
    const normalized = data.map(val => 30 - ((val - min) / range) * 30);
    
    // Create points for SVG path
    const points = normalized.map((val, i) => `${i * 15},${val}`).join(' ');
    
    // Determine color based on trend
    const color = data[data.length - 1] >= data[0] ? '#10B981' : '#EF4444';
    
    return `<svg width="${isMobile ? '80' : '120'}" height="40" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" />
    </svg>`;
  };

  // Render filter buttons
  const renderFilterButtons = () => (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-sm text-gray-600 font-medium">Filter:</span>
      <div className="flex space-x-2">
        <button 
          onClick={() => handleFilterChange('all')} 
          className={`text-sm px-2 py-1 rounded ${filterOption === 'all' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}
        >
          All Assets
        </button>
        <button 
          onClick={() => handleFilterChange('topGainers')} 
          className={`text-sm px-2 py-1 rounded ${filterOption === 'topGainers' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
        >
          Top Gainers
        </button>
        <button 
          onClick={() => handleFilterChange('topLosers')} 
          className={`text-sm px-2 py-1 rounded ${filterOption === 'topLosers' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
        >
          Top Losers
        </button>
      </div>
    </div>
  );

  // Mobile view: Card-based layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {renderFilterButtons()}
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">Sort by:</span>
          <button 
            onClick={() => handleSort('rank')} 
            className={`text-sm px-2 py-1 rounded ${sortKey === 'rank' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            Rank {getSortIndicator('rank')}
          </button>
          <button 
            onClick={() => handleSort('price')} 
            className={`text-sm px-2 py-1 rounded ${sortKey === 'price' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            Price {getSortIndicator('price')}
          </button>
          <button 
            onClick={() => handleSort('percentChange24h')} 
            className={`text-sm px-2 py-1 rounded ${sortKey === 'percentChange24h' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            24h % {getSortIndicator('percentChange24h')}
          </button>
          <button 
            onClick={() => handleSort('marketCap')} 
            className={`text-sm px-2 py-1 rounded ${sortKey === 'marketCap' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
          >
            Market Cap {getSortIndicator('marketCap')}
          </button>
        </div>
        
        {sortedAssets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            No assets match the current filter.
          </div>
        ) : (
          sortedAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center mb-3">
                <span className="text-gray-500 text-sm mr-2">{asset.rank}</span>
                <div className="flex items-center flex-1">
                  <img className="h-8 w-8 rounded-full" src={asset.logo} alt={asset.name} />
                  <div className="ml-2">
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-gray-500">{asset.symbol}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${asset.percentChange24h >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {asset.percentChange24h >= 0 ? '+' : ''}{asset.percentChange24h.toFixed(2)}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className={`font-medium ${hasValueChanged(asset.id, 'price') ? 'animate-flash-green' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.price}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatCurrency(asset.price)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">24h Volume</div>
                  <div className={`text-sm ${hasValueChanged(asset.id, 'volume24h') ? 'animate-flash-green' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.volume24h}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatCurrency(asset.volume24h)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Market Cap</div>
                  <div className="text-sm">{formatCurrency(asset.marketCap)}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Circulating Supply</div>
                  <div className="text-sm">{formatNumber(asset.circulatingSupply)} {asset.symbol}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <div>
                      <div className="text-xs text-gray-500">1h %</div>
                      <div className={`text-sm ${asset.percentChange1h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.percentChange1h >= 0 ? '+' : ''}{asset.percentChange1h.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">24h %</div>
                      <div className={`text-sm ${asset.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.percentChange24h >= 0 ? '+' : ''}{asset.percentChange24h.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">7d %</div>
                      <div className={`text-sm ${asset.percentChange7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.percentChange7d >= 0 ? '+' : ''}{asset.percentChange7d.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 text-center">Last 7 Days</div>
                    <div dangerouslySetInnerHTML={{ __html: generateSparkline(asset.sparklineData) }} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop view: Table layout
  return (
    <div>
      {renderFilterButtons()}
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center">
                  <span># </span>
                  {sortKey === 'rank' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end">
                  <span>Price </span>
                  {sortKey === 'price' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentChange1h')}
              >
                <div className="flex items-center justify-end">
                  <span>1h % </span>
                  {sortKey === 'percentChange1h' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentChange24h')}
              >
                <div className="flex items-center justify-end">
                  <span>24h % </span>
                  {sortKey === 'percentChange24h' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('percentChange7d')}
              >
                <div className="flex items-center justify-end">
                  <span>7d % </span>
                  {sortKey === 'percentChange7d' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('marketCap')}
              >
                <div className="flex items-center justify-end">
                  <span>Market Cap </span>
                  {sortKey === 'marketCap' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('volume24h')}
              >
                <div className="flex items-center justify-end">
                  <span>24h Volume </span>
                  {sortKey === 'volume24h' && (
                    <span className={`ml-1 text-sm ${sortDirection === 'asc' ? 'text-green-600' : 'text-red-600'}`}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Circulating Supply
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last 7 Days
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedAssets.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                  No assets match the current filter.
                </td>
              </tr>
            ) : (
              sortedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={asset.logo} alt={asset.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${hasValueChanged(asset.id, 'price') ? 'animate-flash-green' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.price}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatCurrency(asset.price)}
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${asset.percentChange1h >= 0 ? 'text-green-600' : 'text-red-600'} ${hasValueChanged(asset.id, 'percentChange1h') ? asset.percentChange1h >= 0 ? 'animate-flash-green' : 'animate-flash-red' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.percentChange1h}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {asset.percentChange1h >= 0 ? '+' : ''}{asset.percentChange1h.toFixed(2)}%
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${asset.percentChange24h >= 0 ? 'text-green-600' : 'text-red-600'} ${hasValueChanged(asset.id, 'percentChange24h') ? asset.percentChange24h >= 0 ? 'animate-flash-green' : 'animate-flash-red' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.percentChange24h}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {asset.percentChange24h >= 0 ? '+' : ''}{asset.percentChange24h.toFixed(2)}%
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${asset.percentChange7d >= 0 ? 'text-green-600' : 'text-red-600'} ${hasValueChanged(asset.id, 'percentChange7d') ? asset.percentChange7d >= 0 ? 'animate-flash-green' : 'animate-flash-red' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.percentChange7d}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {asset.percentChange7d >= 0 ? '+' : ''}{asset.percentChange7d.toFixed(2)}%
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatCurrency(asset.marketCap)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500 ${hasValueChanged(asset.id, 'volume24h') ? 'animate-flash-green' : ''}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={asset.volume24h}
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {formatCurrency(asset.volume24h)}
                      </motion.div>
                    </AnimatePresence>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatNumber(asset.circulatingSupply)} {asset.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div dangerouslySetInnerHTML={{ __html: generateSparkline(asset.sparklineData) }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;