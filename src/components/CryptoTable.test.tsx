import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import CryptoTable from '../components/CryptoTable';
import { CryptoState } from '../types/crypto';


const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value;
    },
    clear: function() {
      store = {};
    },
    removeItem: function(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });


window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('CryptoTable Component', () => {
  const mockState: CryptoState = {
    assets: [
      {
        id: 1,
        rank: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        logo: 'bitcoin.png',
        price: 60000,
        percentChange1h: 0.5,
        percentChange24h: 2.5,
        percentChange7d: 5.0,
        marketCap: 1200000000000,
        volume24h: 40000000000,
        circulatingSupply: 19000000,
        sparklineData: [59000, 59500, 60000, 60500, 60000, 60200, 60000],
        lastUpdated: Date.now()
      },
      {
        id: 2,
        rank: 2,
        name: 'Ethereum',
        symbol: 'ETH',
        logo: 'ethereum.png',
        price: 3000,
        percentChange1h: -0.3,
        percentChange24h: -1.5,
        percentChange7d: 2.0,
        marketCap: 350000000000,
        volume24h: 20000000000,
        circulatingSupply: 120000000,
        sparklineData: [2950, 2980, 3000, 3020, 3010, 3000, 3000],
        lastUpdated: Date.now()
      }
    ],
    loading: false,
    error: null,
    connectionStatus: 'connected'
  };

  beforeEach(() => {
    localStorageMock.clear();
  });

  test('renders without crashing', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  test('sorts assets by rank ascending by default', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
    const rows = screen.getAllByRole('row');
  
    expect(rows.length).toBe(3);
    
   
    expect(rows[1]).toHaveTextContent('Bitcoin');
    
    expect(rows[2]).toHaveTextContent('Ethereum');
  });

  test('changes sort direction when clicking the same column header', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
    
    fireEvent.click(screen.getByText('#'));
    
    
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Ethereum');
    expect(rows[2]).toHaveTextContent('Bitcoin');
  });

  test('filters to show only top gainers', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
    
    fireEvent.click(screen.getByText('Top Gainers'));
    
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2);
    expect(rows[1]).toHaveTextContent('Bitcoin');
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  test('filters to show only top losers', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
    
    fireEvent.click(screen.getByText('Top Losers'));
    
   
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(2);
    expect(rows[1]).toHaveTextContent('Ethereum');
    expect(screen.queryByText('Bitcoin')).not.toBeInTheDocument();
  });

  test('saves sorting preferences to localStorage', () => {
    render(<CryptoTable />, {
      preloadedState: { crypto: mockState }
    });
    
 
    fireEvent.click(screen.getByText('Price'));
    
   
    expect(localStorage.getItem('crypto_sort_key')).toBe('price');
    expect(localStorage.getItem('crypto_sort_direction')).toBe('desc');
  });
});