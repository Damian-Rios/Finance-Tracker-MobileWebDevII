import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTransactions } from '../contexts/TransactionContext';

const EditTransactionScreen = ({ route, navigation }) => {
  // Destructuring the transaction ID from route parameters
  const { id } = route.params;

  // Accessing transactions and the edit function from context
  const { transactions, editTransaction } = useTransactions();

  // Finding the transaction to edit
  const transaction = transactions.find((tx) => tx.id === id);

  // Initializing state with values from the transaction
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);
  const [type, setType] = useState(transaction.type);

  // Handles the edit submission
  const handleEdit = () => {
    editTransaction(id, {
      amount: parseFloat(amount), // Convert amount back to number
      description,
      category,
      date,
      type,
    });
    navigation.goBack(); // Navigate back after saving
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Transaction</Text>

      {/* Input for transaction amount */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Input for transaction description */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Input for transaction category */}
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Input for transaction date */}
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />

      {/* Picker for transaction type */}
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>

      {/* Button to submit changes */}
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      {/* Button to go back without saving */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styling for the screen elements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    paddingTop: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1aa7ec',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditTransactionScreen;