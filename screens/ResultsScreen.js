import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export default function ResultsScreen() {
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("https://tgryl.pl/quiz/results?last=20");
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nick}>{item.nick}</Text>
            <Text style={styles.info}>Wynik: {item.score}/{item.total} | {item.type}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  card: { padding: 15, backgroundColor: 'white', marginBottom: 8, borderRadius: 5 },
  nick: { fontFamily: 'Montserrat_700Bold', fontSize: 16 },
  info: { fontFamily: 'Roboto_400Regular', fontSize: 14 },
  date: { fontSize: 10, color: '#aaa' }
});
