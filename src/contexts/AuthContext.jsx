import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, firebaseApp } from '../utils/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Create a new context to hold authentication-related data and methods
const AuthContext = createContext();

// Initialize Firestore instance
const firestore = getFirestore(firebaseApp);

// This provider wraps the app and supplies the auth state to all child components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the currently authenticated user
  const [loading, setLoading] = useState(true); // Indicates whether the auth state is still loading

  // Runs once when the component mounts
  useEffect(() => {
    // Subscribe to Firebase auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Set the user if logged in
      setLoading(false);     // Stop loading once auth state is known
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Logs the user in and records the login in Firestore
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Log login event to Firestore
    await setDoc(doc(firestore, 'activityLogs', user.uid), {
      email: user.email,
      lastLogin: new Date().toISOString(),
    });

    return user;
  };

  // Creates a new account and logs signup time in Firestore
  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Log signup event to Firestore
    await setDoc(doc(firestore, 'activityLogs', user.uid), {
      email: user.email,
      createdAt: new Date().toISOString(),
    });

    return user;
  };

  // Logs the user out
  const logout = async () => {
    await signOut(auth);
  };

  // Provide user data and auth methods to the rest of the app
  return (
    <AuthContext.Provider value={{ user, setUser, logout, login, signup }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth data and methods
export const useAuth = () => useContext(AuthContext);
