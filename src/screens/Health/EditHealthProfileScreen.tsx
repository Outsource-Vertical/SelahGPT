import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, Switch, View } from 'react-native';
import { saveHealthProfile } from '@services/health';

export default function EditHealthProfileScreen({ route, navigation }) {
  const { user, profile } = route.params;

  const [healthConditions, setHealthConditions] = useState(profile.healthConditions?.join(', ') || '');
  const [dietaryRestrictions, setDietaryRestrictions] = useState(profile.dietaryRestrictions?.join(', ') || '');
  const [allergies, setAllergies] = useState(profile.allergies?.join(', ') || '');
  const [sleepQuality, setSleepQuality] = useState(profile.sleepQuality || '');
  const [exerciseRoutine, setExerciseRoutine] = useState(profile.exerciseRoutine || '');
  const [medicationSchedule, setMedicationSchedule] = useState(profile.medicationSchedule || '');
  const [recentSymptoms, setRecentSymptoms] = useState(profile.recentSymptoms?.join(', ') || '');
  const [mentalHealthFocus, setMentalHealthFocus] = useState(profile.mentalHealthFocus || '');
  const [wantsHealthEncouragement, setWantsHealthEncouragement] = useState(profile.wantsHealthEncouragement || false);

  const handleSave = async () => {
    await saveHealthProfile(user.uid, {
      healthConditions: healthConditions.split(',').map(str => str.trim()),
      dietaryRestrictions: dietaryRestrictions.split(',').map(str => str.trim()),
      allergies: allergies.split(',').map(str => str.trim()),
      sleepQuality,
      exerciseRoutine,
      medicationSchedule,
      recentSymptoms: recentSymptoms.split(',').map(str => str.trim()),
      mentalHealthFocus,
      wantsHealthEncouragement,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Health Profile</Text>

      <Text>Health Conditions (comma-separated)</Text>
      <TextInput value={healthConditions} onChangeText={setHealthConditions} style={inputStyle} />

      <Text>Dietary Restrictions</Text>
      <TextInput value={dietaryRestrictions} onChangeText={setDietaryRestrictions} style={inputStyle} />

      <Text>Allergies</Text>
      <TextInput value={allergies} onChangeText={setAllergies} style={inputStyle} />

      <Text>Sleep Quality</Text>
      <TextInput value={sleepQuality} onChangeText={setSleepQuality} style={inputStyle} />

      <Text>Exercise Routine</Text>
      <TextInput value={exerciseRoutine} onChangeText={setExerciseRoutine} style={inputStyle} />

      <Text>Medication Schedule</Text>
      <TextInput value={medicationSchedule} onChangeText={setMedicationSchedule} style={inputStyle} />

      <Text>Recent Symptoms</Text>
      <TextInput value={recentSymptoms} onChangeText={setRecentSymptoms} style={inputStyle} />

      <Text>Mental Health Focus</Text>
      <TextInput value={mentalHealthFocus} onChangeText={setMentalHealthFocus} style={inputStyle} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ flex: 1 }}>Wants Health Encouragement</Text>
        <Switch value={wantsHealthEncouragement} onValueChange={setWantsHealthEncouragement} />
      </View>

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 8,
  marginBottom: 12,
};
