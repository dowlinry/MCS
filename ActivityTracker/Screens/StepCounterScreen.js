import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import BackgroundTimer from 'react-native-background-timer'

import database from '@react-native-firebase/database';

const StepCounterScreen = () => {
  const [displayedSteps, setDisplayedSteps] = useState(0);
  var initSteps = 0;
  var totalSteps = 0;
  var loading = true;

  BackgroundTimer.runBackgroundTimer(() => {}, 500); // Stops app from going inactive when in background / when phone locked

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
    const config = {
      default_threshold: 15.0,
      default_delay: 500000000,
      cheatInterval: 3000,
      onStepCountChange: (stepCount) => {
        if(!loading){ 
          totalSteps = stepCount + initSteps;
          setDisplayedSteps(totalSteps);
          database().ref(`DailySteps/${getDate()}`).set({
            value: totalSteps
          })
        }
      },
      onCheat: () => { console.log("User is Cheating") }
    }
    startCounter(config);
    return () => { stopCounter() }
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