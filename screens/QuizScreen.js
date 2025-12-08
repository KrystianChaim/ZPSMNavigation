import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { saveResult } from "../storage/resultsStorage";

const tasks = [
  {
    question: "Który wódz prowadził wojnę z Sullą?",
    answers: [
      { content: "Lucjusz Cynna", isCorrect: true },
      { content: "Juliusz Cezar", isCorrect: false },
      { content: "Lucjusz Murena", isCorrect: false },
      { content: "Marek Krassus", isCorrect: false }
    ]
  },
  {
    question: "Stolica Włoch to:",
    answers: [
      { content: "Mediolan", isCorrect: false },
      { content: "Rzym", isCorrect: true },
      { content: "Neapol", isCorrect: false }
    ]
  },
];

export default function QuizScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [finished, setFinished] = useState(false);

  const current = tasks[step];

  function choose(index) {
    if (current.answers[index].isCorrect) setScore(score + 1);

    if (step + 1 < tasks.length) setStep(step + 1);
    else setFinished(true);
  }

  async function save() {
    if (!name.trim()) return;

    await saveResult({
      nick: name,
      score,
      total: tasks.length,
      type: "historia",
      date: new Date().toISOString().slice(0, 10)
    });

    navigation.navigate("Results");
  }

  if (finished)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Koniec!</Text>
        <Text style={styles.result}>
          Twój wynik: {score}/{tasks.length}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Podaj imię"
          value={name}
          onChangeText={setName}
        />

        <Button title="Zapisz wynik" onPress={save} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{current.question}</Text>

      {current.answers.map((a, i) => (
        <View key={i} style={{ marginVertical: 6 }}>
          <Button title={a.content} onPress={() => choose(i)} />
        </View>
      ))}

      <Text style={{ marginTop: 20 }}>
        Pytanie {step + 1}/{tasks.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, marginBottom: 20, textAlign: "center" },
  result: { fontSize: 20, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1, padding: 10, marginVertical: 20,
    fontSize: 18, borderRadius: 8
  }
});
