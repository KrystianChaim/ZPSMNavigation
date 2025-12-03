import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ---------------- Drawer zawierający ekrany ------------------

function DrawerMenu() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "#0A84FF",
        drawerLabelStyle: { fontSize: 18 },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: "Ekran główny" }} 
      />

      <Drawer.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ title: "Quiz" }} 
      />

      <Drawer.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ title: "Wyniki" }} 
      />
    </Drawer.Navigator>
  );
}

// ---------------- Root App ------------------

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Cała aplikacja to Drawer */}
          <Stack.Screen name="Root" component={DrawerMenu} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
