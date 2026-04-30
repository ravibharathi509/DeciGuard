import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚 DeciGuard</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Librarian Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    alignItems:'center',
    backgroundColor:'#fff'
  },
  logo: { 
    fontSize:32, 
    fontWeight:'bold', 
    marginBottom:40 
  },
  button: { 
    backgroundColor:'#000', 
    padding:15, 
    borderRadius:10 
  },
  buttonText: { 
    color:'#fff', 
    fontWeight:'bold' 
  }
});