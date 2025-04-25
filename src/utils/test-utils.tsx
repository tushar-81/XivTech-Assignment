import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import cryptoReducer from '../features/cryptoSlice';
import { CryptoState } from '../types/crypto';


interface AppStore {
  crypto: CryptoState;
}


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


export * from '@testing-library/react';


export { render };