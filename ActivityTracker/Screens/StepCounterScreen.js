import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes
} from "react-native-sensors";

import database from '@react-native-firebase/database';
import _BackgroundTimer from 'react-native-background-timer'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Push data to firebase every minute
_BackgroundTimer.runBackgroundTimer(() => {
  pushSteps();
}, 5000); 

const StepCounterScreen = ({navigation, route}) => {
  const [displayedSteps, setDisplayedSteps] = useState(0);

  const username = route.params.username;

  var initSteps = 0;
  var totalSteps = 0;

  var prevMagnitude = 0;

  var loading = true;

  setUpdateIntervalForType(SensorTypes.accelerometer, 100); // defaults to 100ms


  if(loading){
    database()
    .ref(`${username}/PhysicalActivityData/${getDate()}`)
    .once('value')
    .then(snapshot => {
      if(snapshot.val()){
        initSteps = snapshot.val().value;
        totalSteps = initSteps;
        loading = false;
      }
      else{
        database()
        .ref(`${username}/PhysicalActivityData/${getDate()}`).set({
          value: 0
        })
      }
    });
  }

  const signOut = async () => {
    await AsyncStorage.setItem('username', "")
    console.log("test")
    navigation.navigate('Login')
    
  }

  useEffect(() => {
    accelerometer.subscribe(
      ({x, y, z}) => {
        if(!loading){
          let magnitude = Math.sqrt(x*x + y*y + z*z)
          let magnitudeDelta = magnitude - prevMagnitude;
          prevMagnitude = magnitude

          if(magnitudeDelta > 6){
            totalSteps++;
            storeSteps(totalSteps);
            setDisplayedSteps(totalSteps);
          }
        }
      }
    )
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <Text style={styles.title}>Steps Taken Today</Text>
        <Text style={styles.step}>{displayedSteps}</Text>
        <Text style = {styles.username}>Signed in as: <Text style={{fontWeight: 'bold'}}>{username}</Text></Text>
        <Button
                onPress={signOut}
                title="Sign Out"
                color='#1B79B7'
        />
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

const getUsername = async () => { 
  const jsonValue = await AsyncStorage.getItem('username')
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
const pushSteps = async () => {
  const username = await getUsername();

  readSteps().then(steps => {
    database()
    .ref(`${username}/PhysicalActivityData/${getDate()}`).set({
      value: steps
    })
  });

  // readSteps().then(steps => {
  //   database()
  //   .set(`${username}/PhysicalActivityData/${getDate()}`, {value: steps})
  // });
}

function getDate(){
  let date = new Date();
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); 
  let yyyy = date.getFullYear();

  return mm + '-' + dd + '-' + yyyy
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontWeight: 'bold',
    fontSize: 24
  },

  step: {
    fontSize: 40,
    marginTop: 10,
    marginBottom: 30
  },

  username: {
    fontSize: 24,
    justifyContent: 'flex-start',
    marginBottom: 20
  }

});

export default StepCounterScreen;