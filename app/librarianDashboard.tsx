import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { db, auth, firestore } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function LibrarianDashboard() {
  const router = useRouter();

  const [libraryId, setLibraryId] = useState<string | null>(null);
  const [desks, setDesks] = useState<any[]>([]);

  // 🔥 Get libraryId
  useEffect(() => {
    const loadLibrary = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(firestore, 'librarians', user.uid));

      if (snap.exists()) {
        setLibraryId(snap.data().libraryId);
      }
    };

    loadLibrary();
  }, []);

  // 🔥 Listen desks
  useEffect(() => {
    if (!libraryId) return;

    const desksRef = ref(db, 'desks');

    const unsub = onValue(desksRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setDesks([]);
        return;
      }

      let arr = Object.keys(data)
        .map((key) => ({
          id: key,
          ...data[key]
        }))
        .filter((item: any) => item.libraryId === libraryId);

      // loud first top
      arr.sort((a: any, b: any) => {
        if (a.status === 'LOUD' && b.status !== 'LOUD') return -1;
        if (a.status !== 'LOUD' && b.status === 'LOUD') return 1;
        return 0;
      });

      setDesks(arr);
    });

    return () => unsub();
  }, [libraryId]);

  // 🔥 Start Connect Request
  const startConnect = async (deskId: string) => {
    try {
      await update(ref(db, 'desks/' + deskId), {
        connectRequest: true,
        connected: false,
        monitoring: false
      });

      Alert.alert('Waiting', 'Device response waiting...');
    } catch {
      Alert.alert('Error', 'Failed');
    }
  };

  // 🔥 Stop Connect
  const stopConnect = async (deskId: string) => {
    try {
      await update(ref(db, 'desks/' + deskId), {
        connectRequest: false,
        connected: false,
        monitoring: false
      });

      Alert.alert('Stopped', `${deskId} disconnected`);
    } catch {
      Alert.alert('Error', 'Failed');
    }
  };

  const getColor = (item: any) => {
    if (!item.connected) return '#999';
    if (item.status === 'LOUD') return '#ff4d4d';
    if (item.status === 'MODERATE') return '#ffb300';
    return '#00c853';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📚 Librarian Dashboard</Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await signOut(auth);
            router.replace('/');
          }}
        >
          <Text style={{ color: '#fff' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Add Device */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          router.push({
            pathname: '/addDevice',
            params: { libraryId }
          })
        }
      >
        <Text style={styles.addTxt}>➕ Add Device</Text>
      </TouchableOpacity>

      {/* Device List */}
      <FlatList
        data={desks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30 }}>
            No Devices
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                borderColor: getColor(item),
                backgroundColor:
                  item.status === 'LOUD' && item.connected
                    ? '#ffe5e5'
                    : '#fff'
              }
            ]}
          >
            <Text style={styles.desk}>📍 {item.id}</Text>

            <Text>Volume: {item.level || 0} dB</Text>
            <Text>Status: {item.status || 'SILENT'}</Text>

            <Text>
              Connection:{' '}
              {item.connected ? '🟢 Connected' : '🔴 Not Connected'}
            </Text>

            <Text>
              Monitor:{' '}
              {item.monitoring ? '🎤 Running' : '⛔ Stopped'}
            </Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.greenBtn}
                onPress={() => startConnect(item.id)}
              >
                <Text style={styles.btnTxt}>Start Connect</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.redBtn}
                onPress={() => stopConnect(item.id)}
              >
                <Text style={styles.btnTxt}>Stop Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 18,
    paddingTop: 50
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold'
  },

  logoutBtn: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8
  },

  addBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    marginTop: 18,
    marginBottom: 15
  },

  addTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 14,
    padding: 15,
    marginBottom: 14
  },

  desk: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },

  row: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between'
  },

  greenBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    width: '48%'
  },

  redBtn: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    width: '48%'
  },

  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});