import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Login screen component for existing users
const LoginScreen = () => {
  const { login } = useAuth(); // Get login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook

  // Handle login button press
  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        autoCapitalize="none"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Navigate to Signup Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '#f0f4f8',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 32,
      color: '#333',
      textAlign: 'center',
    },
    input: {
      height: 50,
      backgroundColor: '#fff',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 15,
      marginBottom: 18,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    button: {
      backgroundColor: '#4a90e2',
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    error: {
      color: '#d32f2f',
      marginBottom: 12,
      textAlign: 'center',
      fontSize: 14,
    },
    signupText: {
      color: '#4a90e2',
      textAlign: 'center',
      fontSize: 14,
      marginTop: 16,
    },
    linkText: {
      color: '#4a90e2',
      textAlign: 'center',
      fontSize: 14,
      marginTop: 16,
    },
  });
  