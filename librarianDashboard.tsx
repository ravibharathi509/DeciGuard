import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { db, auth, firestore } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';

export default function LibrarianDashboard() {
  const [desks, setDesks] = useState<any[]>([]);
  const [libraryId, setLibraryId] = useState<string | null>(null);
  const router = useRouter();

  // 🔥 Get logged-in user's libraryId
  useEffect(() => {
    const fetchLibrary = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(firestore, "librarians", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLibraryId(docSnap.data().libraryId);
      }
    };

    fetchLibrary();
  }, []);

  // 🔥 Fetch desks (filter by libraryId)
  useEffect(() => {
    if (!libraryId) return;

    const desksRef = ref(db, 'desks/');
    const unsubscribe = onValue(desksRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const filtered = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(d => d.libraryId === libraryId); // 🔥 filter

        setDesks(filtered);
      } else {
        setDesks([]);
      }
    });

    return () => unsubscribe();
  }, [libraryId]);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Librarian Dashboard</Text>

        <TouchableOpacity
          onPress={() => {
            signOut(auth);
            router.replace('/');
          }}
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ADD DEVICE BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push({
            pathname: '/addDevice',
            params: { libraryId } // 🔥 pass pannrom
          })
        }
      >
        <Text style={styles.addText}>➕ Add Device</Text>
      </TouchableOpacity>

      {/* DEVICE LIST */}
      <FlatList
        data={desks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No devices added yet
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.status === 'LOUD' ? styles.loud : styles.silent
            ]}
          >
            <Text style={styles.deskName}>Desk ID: {item.id}</Text>
            <Text>Volume: {item.level} dB</Text>

            <Text
              style={{
                marginTop: 5,
                fontWeight: 'bold',
                color: item.status === 'LOUD' ? 'red' : 'green'
              }}
            >
              Status: {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f6fa'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  logoutBtn: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 6
  },

  logoutText: {
    color: '#fff'
  },

  addBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2
  },

  loud: {
    borderColor: 'red'
  },

  silent: {
    borderColor: '#ddd'
  },

  deskName: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});