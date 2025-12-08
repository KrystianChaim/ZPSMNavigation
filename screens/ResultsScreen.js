import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { getResults } from "../storage/resultsStorage";

export default function ResultsScreen() {
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    const data = await getResults();
    setResults(data.reverse());
  }

  useEffect(() => {
    load();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wyniki graczy</Text>

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.nick}</Text>
            <Text>Wynik: {item.score}/{item.total}</Text>
            <Text>Typ: {item.type}</Text>
            <Text>Data: {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  card: {
    padding: 15, borderWidth: 1, marginBottom: 12, borderRadius: 10
  },
  name: { fontSize: 18, fontWeight: "700", marginBottom: 5 }
});
