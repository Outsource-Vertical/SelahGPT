import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function UpgradeScreen() {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current?.availablePackages) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.error('Failed to load offerings:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    try {
      const { purchaserInfo } = await Purchases.purchasePackage(pkg);

      if (purchaserInfo.entitlements.active[pkg.identifier]) {
        const uid = auth.currentUser?.uid;
        if (uid) {
          await updateDoc(doc(db, 'users', uid), {
            tier: pkg.identifier.includes('faithplus') ? 'faith+' : 'pro',
          });
          alert('Purchase successful!');
        }
      }
    } catch (e) {
      console.error('Purchase error:', e);
      alert('Purchase failed. Please try again.');
    }
  };

  const handleMockUpgrade = async (tier: 'pro' | 'faith+') => {
    try {
      const uid = auth.currentUser?.uid;
      if (uid) {
        await updateDoc(doc(db, 'users', uid), { tier });
        alert(`Mock upgrade to ${tier} complete!`);
      }
    } catch (e) {
      console.error('Mock upgrade error:', e);
      alert('Failed to upgrade.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mock Upgrade Your Plan</Text>
      <Button title="Upgrade to Pro" onPress={() => handleMockUpgrade('pro')} />
      <View style={{ height: 16 }} />
      <Button title="Upgrade to Faith+" onPress={() => handleMockUpgrade('faith+')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 24, marginBottom: 20 },
  card: { marginBottom: 24, padding: 16, borderWidth: 1, borderRadius: 10 },
  packageTitle: { fontSize: 18, fontWeight: 'bold' },
});
