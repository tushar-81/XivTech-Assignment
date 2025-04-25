import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cryptoReducer from '../features/cryptoSlice';
import { CryptoState } from '../types/crypto';

// Define the app store type
interface AppStore {
  crypto: CryptoState;
}

// Create a custom render function that includes the Redux provider wrapper
function render(
  ui: ReactElement,
  {
    preloadedState = {} as Partial<AppStore>,
    store = configureStore({
      reducer: combineReducers({
        crypto: cryptoReducer,
      }),
      preloadedState: preloadedState as any,
    }),
    ...renderOptions
  }: { preloadedState?: Partial<AppStore>; store?: ReturnType<typeof configureStore> } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the render method
export { render };