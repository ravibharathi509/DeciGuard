// signup.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email & password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, "librarians", user.uid), {
        email: email,
        role: "librarian",
        createdAt: Date.now()
      });

      Alert.alert("Success", "Account created!");
      router.replace('/chooseLibrary');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "Email already in use");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 📚</Text>
      <Text style={styles.subtitle}>Register Librarian Access</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/login')}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.link}>
          Already have account? Login
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
  }
});