import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StepCounterScreen from './Screens/Screens';

import database from '@react-native-firebase/database';
import { firebase } from './firebase';

firebase.app();
const stepsToday = getStepsToday();

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

function getStepsToday(){
  let steps = 0;
  database()
  .ref(`DailySteps/${getDate()}`)
  .once('value')
  .then(snapshot => {
    if(snapshot.val()){
      steps = snapshot.val();
    }
  });
  return steps;
}

function getDate(){
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); 
  let yyyy = date.getFullYear();

  return dd + '-' + mm + '-' + yyyy
}

export default App;