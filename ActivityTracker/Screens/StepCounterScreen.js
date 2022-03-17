import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

var loading = true;

const StepCounterScreen = () => {
  const [displayedSteps, setDisplayedSteps] = useState(0);

  var initSteps = 0;
  var totalSteps = 0;

  var lastMovement = 0;

  var loading = true;

  setUpdateIntervalForType(SensorTypes.accelerometer, 1000); // defaults to 100ms


  if(loading){
    database()
    .ref(`DailySteps/${getDate()}`)
    .once('value')
    .then(snapshot => {
      if(snapshot.val()){
        initSteps = snapshot.val().value;
        totalSteps = initSteps;
        setDisplayedSteps(totalSteps);
        loading = false;
      }
    });
  }

  useEffect(() => {
    accelerometer.subscribe(
      ({x, y, z}) => {
        if(!loading){
          const currMovement = x + y + z
          if(Math.abs(currMovement - lastMovement) > 2){
            totalSteps ++;
            storeSteps(totalSteps);
            setDisplayedSteps(totalSteps);
          }
          lastMovement = currMovement;
        }
      }
    )
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <Text>Steps Taken Today</Text>
        <Text style={styles.step}>{displayedSteps}</Text>
      </View>
    </SafeAreaView>
  );

};

const storeSteps = async(value) => {
  try{
    const steps = JSON.stringify(value);
    await AsyncStorage.setItem('steps', steps);
  } catch (e){
    console.log(e);
  }
  
}

const readSteps = async () => {
  const jsonValue = await AsyncStorage.getItem('steps')
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}

const pushSteps = async () => {
  readSteps().then(steps => {
    console.log(steps);
  });

}

function getDate(){
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); 
  let yyyy = date.getFullYear();

  return dd + '-' + mm + '-' + yyyy
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  step: {
    fontSize: 36
  }
});

export default StepCounterScreen;