import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function TabIndex() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome to DeciGuard</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status</Text>
        <Text style={styles.cardText}>Monitoring is active. Please check the Monitor tab for real-time noise levels.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Library Rules</Text>
        <Text style={styles.cardText}>1. Keep your mobile in silent mode.</Text>
        <Text style={styles.cardText}>2. Group discussions are not allowed in the reading zone.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
});