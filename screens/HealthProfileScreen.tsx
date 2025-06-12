import React, { useEffect, useState } from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { getHealthProfile } from '../services/health';
import { HealthProfile } from '../types/HealthProfile';

export default function HealthProfileScreen({ navigation, route }) {
  const user = route.params.user;
  const [profile, setProfile] = useState<HealthProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getHealthProfile(user.uid);
      setProfile(result);
    };
    fetchData();
  }, [user]);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Health Profile</Text>

      {profile.healthConditions?.length > 0 && (
        <Text>Conditions: {profile.healthConditions.join(', ')}</Text>
      )}

      {profile.dietaryRestrictions?.length > 0 && (
        <Text>Dietary Restrictions: {profile.dietaryRestrictions.join(', ')}</Text>
      )}

      {profile.allergies?.length > 0 && (
        <Text>Allergies: {profile.allergies.join(', ')}</Text>
      )}

      {profile.sleepQuality && (
        <Text>Sleep Quality: {profile.sleepQuality}</Text>
      )}

      {profile.exerciseRoutine && (
        <Text>Exercise Routine: {profile.exerciseRoutine}</Text>
      )}

      {profile.medicationSchedule && (
        <Text>Medication Schedule: {profile.medicationSchedule}</Text>
      )}

      {profile.recentSymptoms?.length > 0 && (
        <Text>Recent Symptoms: {profile.recentSymptoms.join(', ')}</Text>
      )}

      {profile.mentalHealthFocus && (
        <Text>Mental Health Focus: {profile.mentalHealthFocus}</Text>
      )}

      <Text>
        Wants Health Encouragement: {profile.wantsHealthEncouragement ? 'Yes' : 'No'}
      </Text>

      <Button
        title="Edit Health Profile"
        onPress={() =>
          navigation.navigate('EditHealthProfile', {
            user,
            profile,
          })
        }
      />
    </ScrollView>
  );
}
