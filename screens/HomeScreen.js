import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Witamy w Quizie!</Text>
        <Text style={styles.subtitle}>Kliknij, aby rozpocząć test</Text>

        <Button title="Rozpocznij Quiz" onPress={() => navigation.navigate("Quiz")} />
      </View>
      

      <View style={styles.footer}>
        <Button title="Zobacz wyniki" onPress={() => navigation.navigate("Results")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: "space-between" },
  top: { alignItems: "center", marginTop: 60 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 10 },
  subtitle: { fontSize: 18, marginBottom: 40 },
  footer: { borderTopWidth: 1, paddingTop: 20, borderColor: "#ccc" }
});
