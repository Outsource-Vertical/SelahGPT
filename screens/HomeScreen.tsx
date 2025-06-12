import { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';



export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        navigation.replace('Login');
      }
    });
  
    return unsubscribe;
  }, []);
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SelahGPT 🎯</Text>
      <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
      <View style={styles.spacer} />
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
      <View style={{ height: 10 }} />
      <Button title="Account" onPress={() => navigation.navigate('Account')} />
      <View style={styles.spacer} />
      <Button title="Log Out" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  spacer: {
    height: 10,
  },
});
