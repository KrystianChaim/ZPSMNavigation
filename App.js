import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0A84FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 22 },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ekran główny' }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ title: 'Ekran testu' }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Ekran wyników' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
