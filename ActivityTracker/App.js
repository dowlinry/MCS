import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StepCounterScreen from './Screens/Screens';

import { firebase } from './firebase';

firebase.app();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Step Counter"
          component={StepCounterScreen}
          // options={{ title: 'Welcome' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;