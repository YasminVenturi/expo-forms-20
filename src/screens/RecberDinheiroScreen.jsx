import React, { useState, useEffect } from 'react';
import { Surface, Text, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecberDinheiroScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        if (storedBalance !== null) {
          setBalance(parseFloat(storedBalance));
        } else {
          setBalance(0.00); // valor padrão inicial
        }
      } catch (error) {
        console.error('Erro ao carregar o saldo:', error);
      }
    };

    loadBalance();
  }, []);

  const registerTransaction = async (amount, type, description) => {
    try {
      const transaction = {
        id: new Date().getTime().toString(),
        type,
        amount,
        description,
        date: new Date().toLocaleString(),
      };

      const existingTransactions = await AsyncStorage.getItem('transactions');
      let transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.push(transaction);

      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Erro ao registrar a transação:', error);
    }
  };

  const handleAddMoney = async () => {
    const amountValue = parseFloat(amount);
    if (!isNaN(amountValue) && amountValue > 0) {
      try {
        const newBalance = balance + amountValue;
        setTransactionStatus('Dinheiro adicionado com sucesso!');
        await registerTransaction(amountValue, 'deposit', description);

        await AsyncStorage.setItem('balance', newBalance.toFixed(2));
        setBalance(newBalance);
        setAmount('');
        setDescription('');

        setTimeout(() => {
          navigation.navigate('BankScreen');
        }, 1000);
      } catch (error) {
        setTransactionStatus('Erro ao atualizar o saldo.');
        console.error('Erro ao salvar o saldo:', error);
      }
    } else {
      setTransactionStatus('Erro: Verifique o valor inserido.');
    }
  };
  const addMoneyToBank = async (amount, description) => {
    if (!amount || amount <= 0) {
      console.warn("Por favor, insira um valor válido maior que 0.");
      return;
    }
  
    const newTransaction = {
      id: Date.now().toString(), // Gera um ID único
      type: "add", // Define como adição
      amount: parseFloat(amount), // Converte para número
      date: new Date().toLocaleString(), // Data e hora atual
      description: description || "Adicionado ao saldo",
      source: "bank", // Origem: banco
    };
  
    try {
      // Atualizar saldo
      const updatedBalance = balance + newTransaction.amount; // Soma ao saldo atual
      setBalance(updatedBalance);
  
      // Atualizar histórico de transações
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
  
      // Salvar no AsyncStorage
      await AsyncStorage.setItem("balance", updatedBalance.toString());
      await AsyncStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  
      console.log("Dinheiro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar dinheiro:", error);
    }
  };
  

  return (
    <Surface style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Adicionar Dinheiro</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Valor"
          mode="outlined"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <TextInput
          label="Descrição"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleAddMoney}
          style={styles.button}
        >
          Adicionar Dinheiro
        </Button>
        {transactionStatus && (
          <Text style={styles.status}>{transactionStatus}</Text>
        )}
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo Atual:</Text>
        <Text style={styles.balanceAmount}>R$ {balance.toFixed(2)}</Text>
      </View>
      <View style={styles.bottomActions}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.bottomButton}
        >
          Voltar
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#a445bd',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#a445bd',
    height: 50,
    borderRadius: 8,
    marginTop: 15,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  balanceContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#444',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: '#a445bd',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomActions: {
    marginTop: 20,
    alignItems: 'center',
  },
  bottomButton: {
    backgroundColor: '#a445bd',
    borderRadius: 8,
    height: 50,
  },
});