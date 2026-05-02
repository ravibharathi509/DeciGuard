// login.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email & password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/chooseLibrary');
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DeciGuard Login 🛡️</Text>
      <Text style={styles.subtitle}>Library Noise Monitoring System</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#7a7a7a"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#7a7a7a"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/signup')}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.link}>
          New Librarian? Signup
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: 10 }}
      >
        <Text style={styles.backLink}>
          Go Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#0B1F3A'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A8FF35',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    color: '#d8d8d8',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 18,
    padding: 14,
    fontSize: 16,
    color: '#000'
  },
  button: {
    backgroundColor: '#A8FF35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#0B1F3A',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    color: '#A8FF35',
    textAlign: 'center',
    fontWeight: '600'
  },
  backLink: {
    color: '#ddd',
    textAlign: 'center'
  }
});