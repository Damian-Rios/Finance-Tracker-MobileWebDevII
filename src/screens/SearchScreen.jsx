import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTransactions } from '../contexts/TransactionContext';

const SearchScreen = ({ navigation }) => {
  // Extracting transactions from context
  const { transactions } = useTransactions(); 
  const [query, setQuery] = useState(''); // State to hold the search query
  const [results, setResults] = useState([]); // State to hold the filtered search results

  // Function to handle the search logic
  const handleSearch = () => {
    // Filter transactions based on query matching description, category, or amount
    const filtered = transactions.filter(txn =>
      txn.description.toLowerCase().includes(query.toLowerCase()) || 
      txn.category.toLowerCase().includes(query.toLowerCase()) ||
      txn.amount.toString().includes(query) // Convert amount to string for comparison
    );
    setResults(filtered); // Update the results state with filtered transactions
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Transactions</Text> {/* Title of the screen */}
      
      {/* Text input to capture user search query */}
      <TextInput
        placeholder="Search transactions"
        style={styles.input}
        value={query}
        onChangeText={setQuery} // Update query state when text changes
      />
      
      {/* Button to trigger search */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* FlatList to display search results */}
      <FlatList
        data={results} // Display the filtered results
        keyExtractor={(item) => item.id.toString()} // Extract key for each item
        renderItem={({ item }) => (
          <View style={styles.result}> {/* Individual transaction result */}
            <Text style={styles.resultText}>{item.description}</Text>
            <Text style={styles.resultText}>{item.category}</Text>
            <Text style={styles.resultText}>{item.amount}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResults}>No results found.</Text>}
      />
      
      {/* Button to navigate back to the previous screen */}
      <TouchableOpacity style={[styles.button]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#f8f8f8', 
    flex: 1 
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
  result: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
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

export default SearchScreen;
