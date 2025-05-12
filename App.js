import React from 'react';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { TransactionProvider } from './src/contexts/TransactionContext';

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppNavigator />
      </TransactionProvider>
    </AuthProvider>
  );
}
