import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "QUIZ_RESULTS";

export async function saveResult(result) {
  const existing = await AsyncStorage.getItem(KEY);
  let results = existing ? JSON.parse(existing) : [];
  results.push(result);
  await AsyncStorage.setItem(KEY, JSON.stringify(results));
}

export async function getResults() {
  const existing = await AsyncStorage.getItem(KEY);
  return existing ? JSON.parse(existing) : [];
}
