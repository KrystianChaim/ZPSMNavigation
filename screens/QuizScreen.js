import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export default function QuizScreen({ route, navigation }) {
  const { testId, testName } = route.params;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [nick, setNick] = useState("");

  useEffect(() => {
    const loadQuiz = async () => {
      const state = await NetInfo.fetch();
      let data = null;

      if (state.isConnected) {
        try {
          const res = await fetch(`https://tgryl.pl/quiz/test/${testId}`);
          data = await res.json();
          await AsyncStorage.setItem(`CACHE_QUIZ_${testId}`, JSON.stringify(data));
        } catch (e) {}
      } else {
        const cached = await AsyncStorage.getItem(`CACHE_QUIZ_${testId}`);
        if (cached) data = JSON.parse(cached);
      }

      if (data) {
        // Losuj pytania i odpowiedzi
        const shuffledTasks = [...data.tasks].sort(() => Math.random() - 0.5).map(task => ({
          ...task,
          answers: [...task.answers].sort(() => Math.random() - 0.5)
        }));
        setTasks(shuffledTasks);
      } else {
        alert("Quiz niedostępny offline. Połącz się z siecią.");  // Obsługa braku internetu
        navigation.goBack();
      }
      setLoading(false);
    };
    loadQuiz();
  }, [testId]);

  const sendResult = async () => {
    if (!nick.trim()) return alert("Podaj nick!");
    try {
      await fetch('https://tgryl.pl/quiz/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, score, total: tasks.length, type: testName }),
      });
      navigation.navigate("Results");
    } catch (e) { navigation.navigate("Results"); }
  };

  if (loading) return <ActivityIndicator size="large" style={{flex:1}} />;

  if (finished) return (
    <View style={styles.container}>
      <Text style={styles.title}>Koniec! Wynik: {score}/{tasks.length}</Text>
      <TextInput style={styles.input} placeholder="Twój nick" value={nick} onChangeText={setNick} />
      <Button title="Zapisz i zakończ" onPress={sendResult} color="#27ae60" />
    </View>
  );

  const current = tasks[step];
  return (
    <View style={styles.container}>
      <Text style={styles.progress}>Pytanie {step + 1} / {tasks.length}</Text>
      <Text style={styles.question}>{current.question}</Text>
      {current.answers.map((ans, i) => (
        <View key={i} style={styles.answerRow}>
          <Button title={ans.content} onPress={() => {
            if (ans.isCorrect) setScore(score + 1);
            if (step + 1 < tasks.length) setStep(step + 1); else setFinished(true);
          }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  progress: { textAlign: 'center', marginBottom: 10, color: '#888' },
  question: { fontFamily: 'Montserrat_700Bold', fontSize: 20, textAlign: 'center', marginBottom: 30 },
  answerRow: { marginVertical: 6 },
  input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5, borderColor: '#ccc' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20, fontFamily: 'Montserrat_700Bold' }
});
