import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import CryptoTable from './components/CryptoTable';
import Header from './components/Header';
import ConnectionSimulator from './components/ConnectionSimulator';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <CryptoTable />
        </main>
        <ConnectionSimulator />
      </div>
    </Provider>
  );
}

export default App;
