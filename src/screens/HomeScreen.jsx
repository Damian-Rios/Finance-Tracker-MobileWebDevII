import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { VictoryBar, VictoryChart, VictoryPie, VictoryTheme } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  const { transactions } = useTransactions(); // Get transactions from context
  const { logout } = useAuth(); // Get logout function from auth context
  const navigation = useNavigation(); // Access navigation for moving between screens

  // State to track income, expenses, and chart data
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [monthlyBalanceData, setMonthlyBalanceData] = useState([]); // Data for bar chart
  const [month, setMonth] = useState(new Date().getMonth()); // Default to current month

  // Runs every time transactions or selected month changes
  useEffect(() => {
    let income = 0;
    let expense = 0;
    const selectedMonth = month;
    const currentYear = new Date().getFullYear();

    // Array to hold income/expense for each month
    const monthlyData = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));

    // Process each transaction
    transactions.forEach(tx => {
      let txDate;

      // Handle different date formats
      if (tx.date?.toDate) {
        txDate = tx.date.toDate(); // Firestore Timestamp
      } else if (typeof tx.date === 'string') {
        const [monthStr, dayStr, yearStr] = tx.date.split('/');
        if (monthStr && dayStr && yearStr) {
          txDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr));
        }
      } else if (typeof tx.date === 'number') {
        txDate = new Date(tx.date); // UNIX timestamp
      } else {
        console.warn('Unknown date format in transaction:', tx);
        return;
      }

      const monthKey = txDate.getMonth();

      // Add to monthly totals
      if (tx.type === 'income') {
        monthlyData[monthKey].income += tx.amount;
      } else if (tx.type === 'expense') {
        monthlyData[monthKey].expense += tx.amount;
      }

      // Sum only transactions in the selected month and current year
      if (txDate.getMonth() === selectedMonth && txDate.getFullYear() === currentYear) {
        if (tx.type === 'income') {
          income += tx.amount;
        } else if (tx.type === 'expense') {
          expense += tx.amount;
        }
      }
    });

    // Update totals and chart data
    setIncomeTotal(income);
    setExpenseTotal(expense);

    setMonthlyBalanceData(
      monthlyData.map((monthData, index) => ({
        x: `${index + 1}`,
        y: monthData.income - monthData.expense, // Net balance
      }))
    );
  }, [transactions, month]);

  // Calculate current month's net balance
  const balance = incomeTotal - expenseTotal;

  // Check if there's data to show in pie chart
  const hasValidData = incomeTotal > 0 || expenseTotal > 0;

  // Prepare pie chart data
  const data = hasValidData
    ? [
        { x: 'Income', y: incomeTotal },
        { x: 'Expenses', y: expenseTotal },
      ]
    : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.title}>Monthly Summary</Text>

        {/* Navigation buttons */}
        <View style={styles.navbarContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('TransactionList')}
          >
            <Text style={styles.buttonText}>Transaction Log</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Month selection dropdown */}
        <Picker
          selectedValue={month}
          style={styles.picker}
          onValueChange={(value) => setMonth(value)}
        >
          {/* Month options */}
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

        {/* Summary cards */}
        <View style={styles.card}>
          <Text style={styles.label}>Income:</Text>
          <Text style={styles.value}>${incomeTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Expenses:</Text>
          <Text style={styles.value}>${expenseTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>${balance.toFixed(2)}</Text>
        </View>
      </View>

      {/* Pie chart for income vs. expense */}
      <View style={styles.chartCard}>
        <Text style={styles.title}>Income vs. Expense</Text>
        {hasValidData ? (
          <VictoryPie
            data={data}
            x="x"
            y="y"
            theme={VictoryTheme.clean}
            colorScale={['green', 'red']}
            style={{
              labels: { fill: 'white', fontSize: 14, fontWeight: 'bold' },
            }}
          />
        ) : (
          <Text style={styles.chartText}>No data available for this month</Text>
        )}
      </View>

      {/* Bar chart showing year overview */}
      <View style={styles.chartCard}>
        <Text style={styles.title}>Yearly Balance Overview</Text>
        <VictoryChart domainPadding={{ x: 20 }} theme={VictoryTheme.clean}>
          <VictoryBar
            data={monthlyBalanceData}
            x="x"
            y="y"
            style={{
              data: {
                fill: ({ datum }) => (datum.y >= 0 ? 'green' : 'red'), // Green = profit, Red = loss
              },
            }}
          />
        </VictoryChart>
      </View>
    </ScrollView>
  );
};

// Style definitions
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    width: '100%',
    marginBottom: 30,
    paddingTop: 30,
  },
  card: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  chartText: {
    color: '#999',
    fontSize: 16,
    marginTop: 30,
  },
  picker: {
    marginBottom: 15,
  },
  chartCard: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
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

export default HomeScreen;
