# Cryptocurrency Price Tracker

A real-time cryptocurrency tracking application built with React, Redux, TypeScript, and Tailwind CSS. This application displays cryptocurrency data with responsive design and features dynamic price updates with visual indicators.

![Sample Output](Sample%20output.gif)

## Features

- **Real-time Price Updates**: Live price simulation with 1.5-second update intervals
- **Responsive Design**: Optimized for both mobile and desktop viewing experiences
- **Sorting & Filtering**: Sort cryptocurrencies by various metrics and filter by performance
- **Data Visualization**: Price trend sparklines and color-coded price movements
- **Persistent User Preferences**: Saves user's sort and filter preferences across sessions
- **Animated UI Elements**: Visual feedback for changing values using Framer Motion

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **State Management**: Redux with Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Build Tool**: Create React App

## Installation Guide

### Prerequisites

- Node.js (version 14.x or later)
- npm or yarn

### Steps to Install

1. **Clone the repository**
   ```
   git clone [repository-url]
   cd xivtech-assignmnet
   ```

2. **Install dependencies**
   ```
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```
   npm start
   # or
   yarn start
   ```

4. **Open the application**
   
   The application will be available at [http://localhost:3000](http://localhost:3000)

## Building for Production

```
npm run build
# or
yarn build
```

The build artifacts will be stored in the `build/` directory, ready for deployment.

## Project Structure

- `src/app/store.ts` - Redux store configuration
- `src/components/` - React components
  - `CryptoTable.tsx` - Main component for displaying cryptocurrency data
  - `Header.tsx` - Application header component
  - `ConnectionSimulator.tsx` - Simulates network activity
- `src/features/cryptoSlice.ts` - Redux slice for cryptocurrency data
- `src/types/crypto.ts` - TypeScript type definitions
- `src/utils/` - Utility functions

## Key Implementation Details

- **Responsive Design**: The application automatically switches between a table view (desktop) and a card view (mobile) based on screen size.
- **State Management**: Redux is used to manage the crypto asset data, with simulated price updates.
- **User Experience**: Animations and color coding provide clear visual feedback on price movements.
- **Data Persistence**: User preferences for sorting and filtering are saved to localStorage.

## Testing

The project includes unit tests for components and reducers. Run the tests with:

```
npm test
# or
yarn test
```


