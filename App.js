import { StatusBar } from 'expo-status-bar';
import {Text, View } from 'react-native';
import {styles} from './src/styles/styles';
import Home from './src/components/Home';

export default function App() {
  return (<>
      <StatusBar style="auto" />
      <Home/>
  </>
      
     
    
  );
}


