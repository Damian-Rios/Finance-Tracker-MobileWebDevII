import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Import all screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import TransactionListScreen from '../screens/TransactionListScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth(); // Get the current user from context

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // If user is logged in, show the main app screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
            <Stack.Screen name="TransactionList" component={TransactionListScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        ) : (
          // If user is NOT logged in, show login/signup
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
