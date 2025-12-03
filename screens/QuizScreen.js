import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import { saveResult } from '../storage/resultsStorage';

const questions = [
  {
    question: "Ile to 2 + 2?",
    answers: ["3", "4", "5"],
    correct: 1
  },
  {
    question: "Stolica Polski to:",
    answers: ["Kraków", "Warszawa", "Wrocław"],
    correct: 1
  },
  {
    question: "Największa planeta w Układzie Słonecznym?",
    answers: ["Mars", "Ziemia", "Jowisz"],
    correct: 2
  }
];

export default function QuizScreen({ navigation }) {

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const [playerName, setPlayerName] = useState("");
  const [isFinished, setIsFinished] = useState(false);

  const current = questions[step];

  function answer(index) {
    if (index === current.correct) {
      setScore(score + 1);
    }

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  }

  async function saveAndExit() {
    if (playerName.trim().length === 0) return;

    await saveResult({
      name: playerName,
      score,
      total: questions.length,
      date: new Date().toLocaleString()
    });

    navigation.navigate("Results");
  }

  // ---------------- RENDER ----------------

  if (isFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Koniec quizu!</Text>
        <Text style={styles.result}>Twój wynik: {score}/{questions.length}</Text>

        <Text style={{ marginTop: 20, fontSize: 18 }}>Podaj swoje imię:</Text>
        <TextInput
          style={styles.input}
          placeholder="Imię gracza"
          value={playerName}
          onChangeText={setPlayerName}
        />

        <Button title="Zapisz wynik" onPress={saveAndExit} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{current.question}</Text>

      {current.answers.map((ans, i) => (
        <View style={{ marginVertical: 8 }} key={i}>
          <Button
            title={ans}
            onPress={() => answer(i)}
          />
        </View>
      ))}

      <Text style={{ marginTop: 30 }}>Pytanie {step + 1}/{questions.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
  },

  result: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center'
  },

  input: {
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 20,
    fontSize: 18,
  }
});
