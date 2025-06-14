import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { saveFitnessProfile } from "@services/fitness";
import { auth } from "@services/firebase";

export default function EditFitnessProfileScreen({ route, navigation }) {
  const { user, profile } = route.params ?? {};
  const currentUser = user || auth.currentUser;

  const [currentWeight, setCurrentWeight] = useState(
    profile?.currentWeight?.toString() || "",
  );
  const [targetWeight, setTargetWeight] = useState(
    profile?.targetWeight?.toString() || "",
  );
  const [height, setHeight] = useState(profile?.height || "");

  const handleSave = async () => {
    if (!currentUser) return;

    await saveFitnessProfile(currentUser.uid, {
      currentWeight: parseFloat(currentWeight),
      targetWeight: parseFloat(targetWeight),
      height,
    });

    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>
        Edit Fitness Profile
      </Text>

      <Text>Current Weight</Text>
      <TextInput
        value={currentWeight}
        onChangeText={setCurrentWeight}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Target Weight</Text>
      <TextInput
        value={targetWeight}
        onChangeText={setTargetWeight}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Height</Text>
      <TextInput
        value={height}
        onChangeText={setHeight}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
}
