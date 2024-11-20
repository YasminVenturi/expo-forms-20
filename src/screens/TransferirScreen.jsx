import React, { useState } from "react";
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Text, Image } from "react-native";
import { Button, Surface } from "react-native-paper";

export default function TransferirScreen({ navigation }) {
  const [amount, setAmount] = useState(""); // Valor da transação
  const [description, setDescription] = useState(""); // Descrição da transação
  const [transactionSuccess, setTransactionSuccess] = useState(false); // Controle de sucesso da transação

  const handleSend = () => {
    if (amount && parseFloat(amount) > 0 && description) {
      setTransactionSuccess(true); // Transação realizada com sucesso
    } else {
      alert("Por favor, insira um valor válido e uma descrição.");
    }
  };

  if (transactionSuccess) {
    return (
      <Surface style={styles.successContainer}>
        {/* Ícone de sucesso */}
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png", // URL do ícone de sucesso
          }}
          style={styles.successIcon}
        />
        <Text style={styles.successTitle}>Transferência Realizada!</Text>
        <Text style={styles.successMessage}>Transação concluída com sucesso.</Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("BankScreen")}
          style={styles.successButton}
          labelStyle={styles.successButtonText}
        >
          Voltar
        </Button>
      </Surface>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Exibição do valor */}
      <Text style={styles.amountText}>
        {amount ? `RS ${parseFloat(amount).toFixed(2)}` : "RS 0,00"}
      </Text>

      {/* Campo de valor (editável diretamente) */}
      <TextInput
        style={styles.amountInput}
        placeholder="Digite o valor"
        placeholderTextColor="#ccc"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Campo de descrição */}
      <TextInput
        placeholder="Digite a descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.descriptionInput}
        placeholderTextColor="#ccc"
      />

      {/* Botão de envio */}
      <Button
        mode="contained"
        onPress={handleSend}
        style={styles.sendButton}
        labelStyle={styles.sendButtonText}
      >
        Send
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", // Cor base
    padding: 20,
    justifyContent: "space-between",
  },
  amountText: {
    fontSize: 45, // Fonte maior
    fontWeight: "bold",
    color: "#a767c6",
    textAlign: "center",
    marginTop: 100,
  },
  amountInput: {
    fontSize: 16, // Fonte menor no input
    height: 35, // Diminui a altura do campo
    borderBottomWidth: 0.5, // Linha inferior mais fina
    borderBottomColor: "#a767c6", // Cor da linha inferior
    textAlign: "center",
    marginVertical: 8, // Menos espaço entre os campos
    color: "#a767c6",
    width: "70%", // Reduzindo o comprimento da linha para 70% da largura do contêiner
    marginLeft: "auto", // Centraliza horizontalmente
    marginRight: "auto", // Centraliza horizontalmente
  },
  descriptionInput: {
    fontSize: 16, // Fonte menor no input
    height: 35, // Diminui a altura do campo
    borderBottomWidth: 0.5, // Linha inferior mais fina
    borderBottomColor: "#a767c6", // Cor da linha inferior
    textAlign: "center",
    marginVertical: 8, // Menos espaço entre os campos
    color: "#a767c6",
    width: "70%", // Reduzindo o comprimento da linha para 70% da largura do contêiner
    marginLeft: "auto", // Centraliza horizontalmente
    marginRight: "auto", // Centraliza horizontalmente
  },
  sendButton: {
    backgroundColor: "#a767c6",
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a767c6",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: "#5a2b84",
    marginBottom: 30,
  },
  successButton: {
    backgroundColor: "#a767c6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  successButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
