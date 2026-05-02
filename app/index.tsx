// index.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚 DeciGuard</Text>

      {/* Librarian Login */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Librarian Login</Text>
      </TouchableOpacity>

      {/* Student Connect */}
      <TouchableOpacity
        style={[styles.button, styles.greenBtn]}
        onPress={() => router.push('/connectDevice')}
      >
        <Text style={styles.buttonText}>Device Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },

  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 40
  },

  button: {
    width: 230,
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  },

  greenBtn: {
    backgroundColor: 'green'
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  }
});