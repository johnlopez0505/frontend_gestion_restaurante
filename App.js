import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import MainScreen from './src/screens/MainScreen';
import ToastConfig from './src/components/ToastConfig';

export default function App() {

  return (
    <>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar style="auto" />
          <MainScreen />
          <Toast  config={ToastConfig} />
        </AuthProvider>
      </NavigationContainer>
    </>  
  );
}


