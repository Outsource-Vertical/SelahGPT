import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Button } from 'react-native';
import { getFaithProfile } from '../services/faith';
import { FaithProfile } from '../types/FaithProfile';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function FaithProfileScreen() {
  const [profile, setProfile] = useState<FaithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await getFaithProfile(user.uid);
        setProfile(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  if (!profile) {
    return (
      <View style={{ padding: 20 }}>
        <Text>No faith profile found yet.</Text>
        <Button
          title="Create Profile"
          onPress={() => navigation.navigate('EditFaithProfile')}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Faith Profile</Text>

      {profile.spiritualBackground && (
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Spiritual Background: {profile.spiritualBackground}
        </Text>
      )}

      {profile.theologicalStyle && (
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Theological Style: {profile.theologicalStyle}
        </Text>
      )}

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Prayer Schedule: {profile.prayerSchedule}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Spiritual Goals: {profile.spiritualGoals?.join(', ') || 'None'}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Favorite Scriptures: {profile.favoriteScriptures?.join(', ') || 'None'}
      </Text>

      {profile.accountabilityPartner && (
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          Accountability Partner: {profile.accountabilityPartner}
        </Text>
      )}

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Devotion Preference: {profile.devotionPreference}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Scripture Encouragement: {profile.wantsScriptureEncouragement ? 'Yes' : 'No'}
      </Text>

      {profile.currentStruggles?.length > 0 && (
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          Current Struggles: {profile.currentStruggles.join(', ')}
        </Text>
      )}

      <Button
        title="Edit Faith Profile"
        onPress={() =>
          navigation.navigate('EditFaithProfile', {
            user: auth.currentUser,
            profile,
          })
        }
      />
    </ScrollView>
  );
}
