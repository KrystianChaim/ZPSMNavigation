import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { getResults } from '../storage/resultsStorage';

export default function ResultsScreen() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getResults();
      setResults(data.reverse()); // najnowsze na górze
    }
    load();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wyniki graczy</Text>

      {results.length === 0 && (
        <Text style={styles.empty}>Brak wyników.</Text>
      )}

      {results.map((res, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.name}>{res.name}</Text>
          <Text>Wynik: {res.score}/{res.total}</Text>
          <Text>Data: {res.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#555'
  },

  card: {
    padding: 15,
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10
  },

  name: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 5
  }
});
