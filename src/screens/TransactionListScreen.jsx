import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTransactions } from '../contexts/TransactionContext';

const TransactionsListScreen = ({ navigation }) => {
  // Using context to retrieve transactions and deleteTransaction function
  const { transactions, deleteTransaction } = useTransactions();
  const [month, setMonth] = useState(new Date().getMonth()); // Default to current month

  // Filtering transactions based on the selected month
  const filteredTransactions = transactions.filter((tx) => {
    let dateObj;

    try {
      // Handling different date formats
      if (tx.date?.toDate) {
        // Firestore Timestamp
        dateObj = tx.date.toDate();
      } else if (typeof tx.date === 'string') {
        // Parse MM/DD/YYYY format explicitly
        const parts = tx.date.split('/');
        if (parts.length === 3) {
          const [monthStr, dayStr, yearStr] = parts;
          const month = parseInt(monthStr, 10);
          const day = parseInt(dayStr, 10);
          const year = parseInt(yearStr, 10);
          dateObj = new Date(year, month - 1, day);
        } else {
          console.warn(`Unrecognized date string format for ${tx.id}:`, tx.date);
          return false;
        }
      } else if (typeof tx.date === 'number') {
        // Milliseconds timestamp
        dateObj = new Date(tx.date);
      } else {
        console.warn(`Unknown date format for transaction ${tx.id}:`, tx.date);
        return false;
      }
    } catch (err) {
      console.error(`Failed to parse date for ${tx.id}:`, err);
      return false;
    }

    const txMonth = dateObj.getMonth(); // Get month (0 = January, 4 = May)
    return txMonth === month; // Filter transactions by selected month
  });

  // Confirm delete action with platform-specific behavior
  const confirm = (message, onConfirm) => {
    if (Platform.OS === 'web') {
      if (window.confirm(message)) onConfirm(); // Web platform confirmation
    } else {
      // Native platform confirmation dialog
      Alert.alert(
        'Confirm',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: onConfirm },
        ]
      );
    }
  };

  // Handle delete transaction
  const confirmDelete = (id) => {
    confirm('Are you sure you want to delete this transaction?', () => {
      deleteTransaction(id); // Delete the selected transaction
    });
  };

  // Render individual transaction item
  const renderItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.amount}>${item.amount}</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('EditTransaction', { id: item.id })} // Navigate to edit screen
        />
        <Button
          title="Delete"
          color="red"
          onPress={() => confirmDelete(item.id)} // Trigger delete confirmation
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      {/* Month Picker */}
      <Picker
        selectedValue={month}
        style={styles.picker}
        onValueChange={(value) => setMonth(value)} // Update the month filter
      >
        {/* Picker items for each month */}
        <Picker.Item label="January" value={0} />
        <Picker.Item label="February" value={1} />
        <Picker.Item label="March" value={2} />
        <Picker.Item label="April" value={3} />
        <Picker.Item label="May" value={4} />
        <Picker.Item label="June" value={5} />
        <Picker.Item label="July" value={6} />
        <Picker.Item label="August" value={7} />
        <Picker.Item label="September" value={8} />
        <Picker.Item label="October" value={9} />
        <Picker.Item label="November" value={10} />
        <Picker.Item label="December" value={11} />
      </Picker>

      {/* Display filtered transactions */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem} // Render each transaction item
      />

      {/* Navigation buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddTransaction')}>
        <Text style={styles.buttonText}>Add Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.buttonText}>Search Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  transactionCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    color: '#4caf50',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default TransactionsListScreen;
