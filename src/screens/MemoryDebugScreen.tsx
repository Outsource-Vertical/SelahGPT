import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { getAllMemoriesForUser } from "@services/memory";
import { auth } from "@services/firebase";
import { summaryGenerator } from "@utils/summaryGenerator";

export default function MemoryDebugScreen() {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchMemories = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const data = await getAllMemoriesForUser(uid);
        setMemories(data);
      } catch (err) {
        console.error("Error loading memory:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const handleGenerateSummary = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setGenerating(true);
    const result = await summaryGenerator({ userId: uid });
    setSummary(result);
    setGenerating(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#777" />
        <Text>Loading memories...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Button
          title="📝 Generate Spiritual Summary"
          onPress={handleGenerateSummary}
          disabled={generating}
        />
        {generating && (
          <Text style={{ marginTop: 8 }}>Generating summary...</Text>
        )}
        {summary && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Spiritual Summary:</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}
      </View>

      {memories.map((m, idx) => (
        <View key={m.id || idx} style={styles.card}>
          <Text style={styles.role}>
            {m.metadata?.role?.toUpperCase() || "USER"}
          </Text>
          <Text style={styles.module}>{m.metadata?.module || "general"}</Text>
          <Text style={styles.text}>{m.metadata?.text}</Text>
          {m.metadata?.tags && m.metadata.tags.length > 0 && (
            <Text style={styles.tags}>Tags: {m.metadata.tags.join(", ")}</Text>
          )}
          <Text style={styles.timestamp}>
            {new Date(m.metadata?.createdAt || "").toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  summaryBox: {
    backgroundColor: "#e6f0ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  role: { fontWeight: "bold", color: "#666" },
  module: { fontStyle: "italic", marginBottom: 4 },
  text: { fontSize: 16, marginBottom: 4 },
  tags: { color: "#888", fontSize: 12, marginBottom: 4 },
  timestamp: { fontSize: 12, color: "#999" },
});
