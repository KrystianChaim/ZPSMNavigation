import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function WelcomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFirstRun() {
      const hasSeen = await AsyncStorage.getItem("SEEN_RULES");

      if (hasSeen) {
        navigation.replace("Root");
      } else {
        setLoading(false);
      }
    }
    checkFirstRun();
  }, []);

  async function accept() {
    await AsyncStorage.setItem("SEEN_RULES", "1");
    navigation.replace("Root");
  }

  if (loading) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regulamin Quizu</Text>

      <Text style={styles.text}>
        • Quiz służy wyłącznie celom edukacyjnym.{"\n"}
        • Wyniki są zapisywane lokalnie w pamięci urządzenia.{"\n"}
        • Kontynuując akceptujesz regulamin.
      </Text>

      <Button title="Akceptuję" onPress={accept} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 40 }
});
