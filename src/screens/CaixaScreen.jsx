import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CaixaScreen({ navigation }) {
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para carregar as caixinhas do AsyncStorage
  const loadBoxes = async () => {
    try {
      const storedBoxes = await AsyncStorage.getItem('boxes');
      const parsedBoxes = storedBoxes ? JSON.parse(storedBoxes) : [];
      setBoxes(parsedBoxes);
    } catch (error) {
      console.error('Erro ao carregar caixinhas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadBoxes();
    }, [])
  );

  const handleBoxPress = (box) => {
    setSelectedBox(box);
  };

  const renderSelectedBox = () => {
    if (!selectedBox) return null;
    return (
      <View style={styles.selectedBoxDetails}>
        <Text style={styles.selectedBoxText}>Caixinha Selecionada: {selectedBox.name}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('CaixaDetailsScreen', { box: selectedBox })
          }
          style={styles.modifyButton}
        >
          <Text style={styles.modifyButtonText}>Modificar Caixinha</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBoxPress(item)} style={styles.boxButton}>
      <Text style={styles.boxText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#a445bd" />
      ) : boxes.length > 0 ? (
        <FlatList
          data={boxes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Text style={styles.noBoxesText}>Nenhuma caixinha encontrada.</Text>
      )}
      {renderSelectedBox()}
      <TouchableOpacity
        style={styles.createBoxButton}
        onPress={() => navigation.navigate('CriarCaixaScreen')}
      >
        <Text style={styles.createBoxText}>Criar Nova Caixinha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  boxButton: {
    backgroundColor: '#a445bd',
    padding: 30,
    borderRadius: 8,
    marginBottom: 15,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noBoxesText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  selectedBoxDetails: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modifyButton: {
    backgroundColor: '#a445bd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  createBoxButton: {
    backgroundColor: '#a445bd',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  createBoxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
