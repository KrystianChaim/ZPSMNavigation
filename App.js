import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';

import SplashScreen from "./screens/SplashScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import QuizScreen from "./screens/QuizScreen";
import ResultsScreen from "./screens/ResultsScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Lodash nie chce działać na snack expo, zamiast niego funkcja pomocnicza do mieszania
const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

function CustomDrawerContent(props) {
  const { tests, onRefresh } = props;

  const navigateToRandom = () => {
    if (tests && tests.length > 0) {
      const random = tests[Math.floor(Math.random() * tests.length)];
      props.navigation.navigate("Quiz", { testId: random.id, testName: random.name });
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
        <Text style={{ fontFamily: 'Montserrat_700Bold', fontSize: 18 }}>Quiz App</Text>
      </View>
      
      <DrawerItem label="Wylosuj test" onPress={navigateToRandom} labelStyle={{ color: '#e67e22', fontWeight: 'bold' }} />
      <DrawerItem label="Odśwież testy" onPress={onRefresh} labelStyle={{ color: '#27ae60' }} />
      
      <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 10 }} />
      
      <DrawerItemList {...props} />
      
      <Text style={{ marginLeft: 20, marginTop: 10, color: '#888', fontSize: 12 }}>Dostępne quizy:</Text>
      {shuffle(tests).map(test => (
        <DrawerItem 
          key={test.id} 
          label={test.name} 
          onPress={() => props.navigation.navigate("Quiz", { testId: test.id, testName: test.name })} 
        />
      ))}
    </DrawerContentScrollView>
  );
}

export default function App() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  let [fontsLoaded] = useFonts({ Montserrat_700Bold, Roboto_400Regular });

  const fetchAndSyncTests = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        const response = await fetch("https://tgryl.pl/quiz/tests");
        const data = await response.json();
        setTests(data);
        await AsyncStorage.setItem("CACHED_TESTS", JSON.stringify(data));
        await AsyncStorage.setItem("LAST_SYNC", new Date().toISOString());
      } catch (e) {
        Alert.alert("Błąd", "Nie udało się pobrać nowych testów.");
      }
    } else {
      const cached = await AsyncStorage.getItem("CACHED_TESTS");
      if (cached) setTests(JSON.parse(cached));
      else Alert.alert("Offline", "Brak internetu i zapisanych testów.");
    }
    setLoading(false);
  };

  // Odświeżaj raz dziennie
  useEffect(() => {
    const checkSync = async () => {
      const lastSync = await AsyncStorage.getItem("LAST_SYNC");
      const oneDay = 24 * 60 * 60 * 1000;
      if (!lastSync || (new Date() - new Date(lastSync) > oneDay)) {
        fetchAndSyncTests();
      } else {
        const cached = await AsyncStorage.getItem("CACHED_TESTS");
        if (cached) setTests(JSON.parse(cached));
        setLoading(false);
      }
    };
    if (fontsLoaded) checkSync();
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large"/></View>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Root">
            {() => (
              <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} tests={tests} onRefresh={fetchAndSyncTests} />}>
                <Drawer.Screen name="Home" component={HomeScreen} options={{ title: "Ekran główny" }} />
                <Drawer.Screen name="Results" component={ResultsScreen} options={{ title: "Wyniki" }} />
              </Drawer.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
