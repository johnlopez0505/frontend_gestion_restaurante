import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import PrivateRoute from './src/components/PrivateRoute';

export default function App() {

  return (
    <>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar style="auto" />
          <PrivateRoute />
        </AuthProvider>
      </NavigationContainer>
    </>  
  );
}


