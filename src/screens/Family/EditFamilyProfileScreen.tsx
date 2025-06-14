import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, Switch, View } from 'react-native';
import { saveFamilyProfile } from '@services/family';

export default function EditFamilyProfileScreen({ route, navigation }) {
  const { user, profile } = route.params;

  const [householdRole, setHouseholdRole] = useState(profile.householdRole || '');
  const [maritalStatus, setMaritalStatus] = useState(profile.maritalStatus || 'single');
  const [numberOfChildren, setNumberOfChildren] = useState(
    profile.numberOfChildren?.toString() || ''
  );
  const [childrenAges, setChildrenAges] = useState(profile.childrenAges || '');
  const [majorFamilyDates, setMajorFamilyDates] = useState(
    profile.majorFamilyDates?.join(', ') || ''
  );
  const [currentFamilyFocus, setCurrentFamilyFocus] = useState(profile.currentFamilyFocus || '');
  const [familyChallenges, setFamilyChallenges] = useState(
    profile.familyChallenges?.join(', ') || ''
  );
  const [gratitudeNotes, setGratitudeNotes] = useState(
    profile.gratitudeNotes?.join(', ') || ''
  );
  const [wantsFamilyEncouragement, setWantsFamilyEncouragement] = useState(
    profile.wantsFamilyEncouragement || false
  );

  const handleSave = async () => {
    await saveFamilyProfile(user.uid, {
      householdRole,
      maritalStatus,
      numberOfChildren: numberOfChildren ? parseInt(numberOfChildren) : undefined,
      childrenAges,
      majorFamilyDates: majorFamilyDates.split(',').map(str => str.trim()),
      currentFamilyFocus,
      familyChallenges: familyChallenges.split(',').map(str => str.trim()),
      gratitudeNotes: gratitudeNotes.split(',').map(str => str.trim()),
      wantsFamilyEncouragement,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Family Profile</Text>

      <Text>Role</Text>
      <TextInput value={householdRole} onChangeText={setHouseholdRole} style={inputStyle} />

      <Text>Marital Status</Text>
      <TextInput value={maritalStatus} onChangeText={setMaritalStatus} style={inputStyle} />

      <Text>Number of Children</Text>
      <TextInput value={numberOfChildren} onChangeText={setNumberOfChildren} style={inputStyle} keyboardType="numeric" />

      <Text>Children Ages</Text>
      <TextInput value={childrenAges} onChangeText={setChildrenAges} style={inputStyle} />

      <Text>Important Family Dates (comma-separated)</Text>
      <TextInput value={majorFamilyDates} onChangeText={setMajorFamilyDates} style={inputStyle} />

      <Text>Current Focus</Text>
      <TextInput value={currentFamilyFocus} onChangeText={setCurrentFamilyFocus} style={inputStyle} />

      <Text>Family Challenges</Text>
      <TextInput value={familyChallenges} onChangeText={setFamilyChallenges} style={inputStyle} />

      <Text>Gratitude Notes</Text>
      <TextInput value={gratitudeNotes} onChangeText={setGratitudeNotes} style={inputStyle} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ flex: 1 }}>Wants Encouragement</Text>
        <Switch value={wantsFamilyEncouragement} onValueChange={setWantsFamilyEncouragement} />
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
