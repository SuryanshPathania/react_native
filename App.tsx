
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import Dashboard from './src/screens/Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkUserSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userdata');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('✅ Found user:', user);
          setUser(user);
        }
      } catch (error) {
        console.error('❌ Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerRight: () => (
                <Button title="Logout" onPress={handleLogout} />
              ),
              headerTitle: 'Dashboard',
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
