import { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat } from "@hooks/useChat";
import { auth } from "@services/firebase";
import { storeMemory } from "@utils/memoryManager";
import { saveFitnessProfile } from "@services/fitness";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, sendMessage, loading } = useChat();
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    const user = auth.currentUser;
    const message = input.trim();

    if (!user || message === "") return;

    try {
      sendMessage(message);

      await storeMemory({
        userId: user.uid,
        module: "chat",
        text: message,
        metadata: { source: "chat_input" },
      });

      const weightMatch = message
        .toLowerCase()
        .match(/(?:weight|weigh)[^\d]*(\d{2,3})/);
      if (weightMatch) {
        const newWeight = parseFloat(weightMatch[1]);
        await saveFitnessProfile(user.uid, { currentWeight: newWeight });

        const confirmation = `Got it! I updated your weight to ${newWeight} lbs.`;
        sendMessage(confirmation);

        await storeMemory({
          userId: user.uid,
          module: "fitness",
          text: confirmation,
          metadata: { action: "updateWeight" },
        });

        setInput("");
        return;
      }

      await sendMessage(message);
    } catch (err) {
      console.error("Chat error:", err);
      Alert.alert(
        "Error",
        "Something went wrong while processing your message.",
      );
    }

    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={[styles.container, { paddingBottom: insets.bottom }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          style={styles.messages}
          contentContainerStyle={{ paddingVertical: 16 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.bubble,
                msg.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.text}>{msg.content}</Text>
            </View>
          ))}
          {loading && (
            <View style={styles.aiBubble}>
              <Text style={styles.text}>Typing...</Text>
            </View>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Button title="Send" onPress={handleSend} disabled={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16 },
  messages: { flex: 1 },
  bubble: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
  },
  text: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 8,
  },
});
