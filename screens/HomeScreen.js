import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [shuffledTests, setShuffledTests] = useState([]);

  useEffect(() => {
    const load = async () => {
      const cached = await AsyncStorage.getItem("CACHED_TESTS");
      if (cached) {
        const data = JSON.parse(cached);
        // Losuj kolejność
        setShuffledTests([...data].sort(() => Math.random() - 0.5));
      }
    };
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={shuffledTests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("Quiz", { testId: item.id, testName: item.name })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.footer}>Poziom: {item.level} | Zadania: {item.numberOfTasks}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 3 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18 },
  desc: { fontFamily: 'Roboto_400Regular', color: '#666', marginVertical: 5 },
  footer: { fontSize: 12, color: '#2980b9', fontWeight: 'bold' }
});
