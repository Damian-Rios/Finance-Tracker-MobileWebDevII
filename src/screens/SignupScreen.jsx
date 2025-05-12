import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); // Access context to set user after signup

  const handleSignup = async () => {
    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // Set user in context
    } catch (error) {
      Alert.alert('Signup Error', error.message); // Display error if signup fails
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

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
  