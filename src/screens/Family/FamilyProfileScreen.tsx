import React, { useEffect, useState } from "react";
import { ScrollView, Text, Button } from "react-native";
import { getFamilyProfile } from "@services/family";
import { FamilyProfile } from "@types/FamilyProfile";

export default function FamilyProfileScreen({ navigation, route }) {
  const user = route.params.user;
  const [profile, setProfile] = useState<FamilyProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getFamilyProfile(user.uid);
      setProfile(result);
    };
    fetchData();
  }, [user]);

  if (!profile) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Family Profile</Text>

      <Text>Role: {profile.householdRole}</Text>
      <Text>Marital Status: {profile.maritalStatus}</Text>
      {profile.numberOfChildren !== undefined && (
        <Text>Children: {profile.numberOfChildren}</Text>
      )}
      {profile.childrenAges && (
        <Text>Children Ages: {profile.childrenAges}</Text>
      )}
      {profile.majorFamilyDates?.length > 0 && (
        <Text>Important Dates: {profile.majorFamilyDates.join(", ")}</Text>
      )}
      {profile.currentFamilyFocus && (
        <Text>Current Focus: {profile.currentFamilyFocus}</Text>
      )}
      {profile.familyChallenges?.length > 0 && (
        <Text>Challenges: {profile.familyChallenges.join(", ")}</Text>
      )}
      {profile.gratitudeNotes?.length > 0 && (
        <Text>Gratitude: {profile.gratitudeNotes.join(", ")}</Text>
      )}
      <Text>
        Wants Encouragement: {profile.wantsFamilyEncouragement ? "Yes" : "No"}
      </Text>

      <Button
        title="Edit Family Profile"
        onPress={() =>
          navigation.navigate("EditFamilyProfile", {
            user,
            profile,
          })
        }
      />
    </ScrollView>
  );
}
