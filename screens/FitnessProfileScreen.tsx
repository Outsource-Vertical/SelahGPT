import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { getFitnessProfile } from '../services/fitness';
import { FitnessProfile } from '../types/FitnessProfile';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function FitnessProfileScreen() {
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const result = await getFitnessProfile(user.uid);
        setProfile(result);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  if (!profile) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No fitness profile found yet.</Text>
        <Button
          title="Create Profile"
          onPress={() => navigation.navigate('EditFitnessProfile')}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Current Weight: {profile.currentWeight}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Target Weight: {profile.targetWeight}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Height: {profile.height}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Workout Style:{' '}
        {Array.isArray(profile.preferredWorkoutTypes)
          ? profile.preferredWorkoutTypes.join(', ')
          : 'Not specified'}
      </Text>

      <Button
        title="Edit Profile"
        onPress={() =>
          navigation.navigate('EditFitnessProfile', {
            user: auth.currentUser,
            profile,
          })
        }
      />
    </ScrollView>
  );
}
