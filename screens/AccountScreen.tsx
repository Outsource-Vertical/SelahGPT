import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

export default function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [usage, setUsage] = useState<number | null>(null);
  const [tier, setTier] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const docSnap = await getDoc(doc(db, 'users', uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsage(data.usage ?? 0);
          setTier(data.tier ?? 'free');
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Account</Text>
      <Text style={styles.info}>Tier: {tier}</Text>
      <Text style={styles.info}>Messages Left Today: {usage !== null ? 10 - usage : 'Loading...'}</Text>

      <View style={{ height: 20 }} />
      <Button title="Upgrade Plan" onPress={() => navigation.navigate('Upgrade')} />
      <View style={{ height: 20 }} />
      <Button title="Log Out" onPress={handleLogout} color="#c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    marginBottom: 12,
  },
});
