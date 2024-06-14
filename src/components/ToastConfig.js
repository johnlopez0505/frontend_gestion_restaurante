import React from 'react';
import { BaseToast } from 'react-native-toast-message';

const ToastConfig = {
  success: ({ text1, text2 }) => (
    <BaseToast
      style={{ 
        backgroundColor:'#D5F5E3',
        borderLeftColor: 'green', 
        height:70,
        position: 'absolute', 
        bottom: '50%', 
        left: '50%', 
        transform: [
            { translateX: -170 }, 
            { translateY: 750 }] 
        }}

      text1={text1}
      text2={text2}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 13,
        color: 'green'
      }}
    />
  ),
  error: ({ text1, text2 }) => (
    <BaseToast
      style={{ 
        backgroundColor:'#FADBD8',
        borderLeftColor: 'red', 
        height:70,
        position: 'absolute', 
        bottom: '50%', 
        left: '50%', 
        transform: [
            { translateX: -170 }, 
            { translateY: 750 }] 
        }}
      text1={text1}
      text2={text2}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 13,
        color: 'red'
      }}
    />
  ),
  info: ({ text1, text2 }) => (
    <BaseToast
      style={{ 
        backgroundColor:'#D6EAF8',
        borderLeftColor: 'blue', 
        height:70,
        position: 'absolute', 
        bottom: '50%', 
        left: '50%', 
        transform: [
            { translateX: -170 }, 
            { translateY: 750 }] 
        }}
      text1={text1}
      text2={text2}
      text1Style={{
        fontSize: 15,
        fontWeight: 'bold'
      }}
      text2Style={{
        fontSize: 13,
        color: '#3498DB'
      }}
    />
  )

};

export default ToastConfig;
