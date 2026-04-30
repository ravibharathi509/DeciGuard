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

      // 🔥 After login → choose library screen
      router.replace('/chooseLibrary');

    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Librarian Login 🛡️</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup */}
      <TouchableOpacity 
        onPress={() => router.push('/signup')} 
        style={{marginTop: 20}}
      >
        <Text style={{color: '#007bff', textAlign: 'center'}}>
          New Librarian? Signup
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.back()} 
        style={{marginTop: 10}}
      >
        <Text style={{color: '#666', textAlign: 'center'}}>
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
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    marginBottom: 20, 
    padding: 10, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#111', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});