import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@services/firebase";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uid) return;

      try {
        const docRef = doc(db, "users", uid, "profile", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", uid, "profile", "data");
      await setDoc(docRef, profile);
      Alert.alert("Success", "Profile updated!");
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading || !profile) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Life Goals</Text>
      <TextInput
        style={styles.input}
        value={profile.goals?.lifeGoals || ""}
        onChangeText={(text) =>
          setProfile({
            ...profile,
            goals: { ...profile.goals, lifeGoals: text },
          })
        }
        placeholder="What are your life goals?"
      />

      <Text style={styles.label}>Spiritual Focus</Text>
      <TextInput
        style={styles.input}
        value={profile.faith?.spiritualFocus || ""}
        onChangeText={(text) =>
          setProfile({
            ...profile,
            faith: { ...profile.faith, spiritualFocus: text },
          })
        }
        placeholder="Spiritual focus this season?"
      />

      {/* Add more fields here as you go */}

      <Button title="Save Changes" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  label: { fontSize: 16, marginTop: 12 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
});
