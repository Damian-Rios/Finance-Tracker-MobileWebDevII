import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTransactions } from '../contexts/TransactionContext';

const AddTransactionScreen = ({ navigation }) => {
  const { addTransaction } = useTransactions(); // Access addTransaction function from context

  // Local state for transaction fields
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString()); // Default to today
  const [type, setType] = useState('income'); // Default to 'income'

  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs: all fields must be filled and amount must be a number
    if (amount && description && category && !isNaN(amount)) {
      // Call context function to add transaction
      addTransaction({
        amount: parseFloat(amount),
        description,
        category,
        date,
        type,
      });

      // Navigate back to the previous screen (e.g., Home)
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      {/* Input for amount */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Input for description */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Input for category */}
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Input for date */}
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />

      {/* Picker to select type (income/expense) */}
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Income" value="income" />
        <Picker.Item label="Expense" value="expense" />
      </Picker>

      {/* Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Back button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the component
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

export default AddTransactionScreen;
