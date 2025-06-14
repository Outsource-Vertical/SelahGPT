import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, Switch } from 'react-native';
import { saveFaithProfile } from '@services/faith';
import { FaithProfile } from '@types/FaithProfile';

export default function EditFaithProfileScreen({ route, navigation }) {
  const { user, profile } = route.params;

  const [spiritualBackground, setSpiritualBackground] = useState(profile.spiritualBackground || '');
  const [theologicalStyle, setTheologicalStyle] = useState(profile.theologicalStyle || '');
  const [prayerSchedule, setPrayerSchedule] = useState(profile.prayerSchedule || '');
  const [spiritualGoals, setSpiritualGoals] = useState(profile.spiritualGoals?.join(', ') || '');
  const [favoriteScriptures, setFavoriteScriptures] = useState(profile.favoriteScriptures?.join(', ') || '');
  const [accountabilityPartner, setAccountabilityPartner] = useState(profile.accountabilityPartner || '');
  const [devotionPreference, setDevotionPreference] = useState(profile.devotionPreference || 'verse of the day');
  const [currentStruggles, setCurrentStruggles] = useState(profile.currentStruggles?.join(', ') || '');
  const [wantsScriptureEncouragement, setWantsScriptureEncouragement] = useState(profile.wantsScriptureEncouragement || false);

  const handleSave = async () => {
    await saveFaithProfile(user.uid, {
      spiritualBackground,
      theologicalStyle,
      prayerSchedule,
      spiritualGoals: spiritualGoals.split(',').map(str => str.trim()),
      favoriteScriptures: favoriteScriptures.split(',').map(str => str.trim()),
      accountabilityPartner,
      devotionPreference,
      currentStruggles: currentStruggles ? currentStruggles.split(',').map(str => str.trim()) : [],
      wantsScriptureEncouragement,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Edit Faith Profile</Text>

      <Text>Spiritual Background</Text>
      <TextInput value={spiritualBackground} onChangeText={setSpiritualBackground} style={inputStyle} />

      <Text>Theological Style</Text>
      <TextInput value={theologicalStyle} onChangeText={setTheologicalStyle} style={inputStyle} />

      <Text>Prayer Schedule</Text>
      <TextInput value={prayerSchedule} onChangeText={setPrayerSchedule} style={inputStyle} />

      <Text>Spiritual Goals (comma-separated)</Text>
      <TextInput value={spiritualGoals} onChangeText={setSpiritualGoals} style={inputStyle} />

      <Text>Favorite Scriptures (comma-separated)</Text>
      <TextInput value={favoriteScriptures} onChangeText={setFavoriteScriptures} style={inputStyle} />

      <Text>Accountability Partner</Text>
      <TextInput value={accountabilityPartner} onChangeText={setAccountabilityPartner} style={inputStyle} />

      <Text>Devotion Preference</Text>
      <TextInput value={devotionPreference} onChangeText={setDevotionPreference} style={inputStyle} />

      <Text>Current Struggles (comma-separated)</Text>
      <TextInput value={currentStruggles} onChangeText={setCurrentStruggles} style={inputStyle} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
        <Text style={{ flex: 1 }}>Wants Scripture Encouragement</Text>
        <Switch value={wantsScriptureEncouragement} onValueChange={setWantsScriptureEncouragement} />
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
