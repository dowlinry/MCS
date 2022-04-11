import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StepCounterScreen, LoginScreen } from './Screens/Screens';

import { firebase } from './firebase';

import { LogBox } from 'react-native';

// supress warnings
LogBox.ignoreLogs(['Warning: ...']); 
LogBox.ignoreAllLogs();

firebase.app();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="StepCounter" component={StepCounterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;