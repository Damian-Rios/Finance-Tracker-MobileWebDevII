import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from './AuthContext';

// Create a new context for transactions
const TransactionContext = createContext();

// Custom hook to easily use the transaction context
export const useTransactions = () => useContext(TransactionContext);

// Context provider component to wrap around parts of the app that need transaction data
export const TransactionProvider = ({ children }) => {
  const { user } = useAuth(); // Get the currently authenticated user
  const [transactions, setTransactions] = useState([]); // State to hold the user's transactions

  useEffect(() => {
    if (!user) return; // Exit if no user is logged in

    // Create a query to fetch transactions that belong to the logged-in user
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    // Listen in real-time for changes to the user's transactions
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(list); // Update state with new transaction list
    });

    // Clean up the listener when the component unmounts or user changes
    return unsubscribe;
  }, [user]);

  // Function to add a new transaction to Firestore
  const addTransaction = async (transaction) => {
    return await addDoc(collection(db, 'transactions'), {
      ...transaction,
      userId: user.uid // Associate the transaction with the current user
    });
  };

  // Function to update an existing transaction by ID
  const editTransaction = async (id, updatedData) => {
    const ref = doc(db, 'transactions', id); // Reference to the specific transaction document
    await updateDoc(ref, updatedData); // Update the transaction
  };

  // Function to delete a transaction by ID
  const deleteTransaction = async (id) => {
    try {
      console.log("Trying to delete:", id);
      const ref = doc(db, 'transactions', id); // Reference to the specific transaction
      await deleteDoc(ref); // Delete the document
      console.log("Successfully deleted.");
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // Provide the transaction data and CRUD functions to any child components
  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      editTransaction,
      deleteTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
