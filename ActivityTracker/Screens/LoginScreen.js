import React, {useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [input, onChangeInput] = useState("");
    const [showErrorText, setShowErrorText] = useState(false);
    const [errorText, setErrorText] = useState("");

    const navigation = useNavigation();

    skipLogin(navigation);

    return (
        <SafeAreaView>
          <View style={styles.screen}>
            {showErrorText && <Text style={styles.errorText}>{errorText}</Text>}
            <Image
              style = {styles.image}
              source={require('../assets/images/github_logo.png')}
            />
            <Text style={styles.text}>Enter your Github username</Text>
            <TextInput
                style= {styles.input}
                onChangeText={onChangeInput}
                value={input}
            />
            <Button
                onPress={verifyUser}
                title="Submit"
                color='#1B79B7'
            />
          </View>
        </SafeAreaView>
      );

    function verifyUser() {
        //console.log(input)
        fetch(`https://api.github.com/users/${input}`)
        .then((response) => response.json())
        .then(async (json) => {
            if(json.message === "Not Found"){
              setShowErrorText(true);
              setErrorText("Invalid username, please try again with your Github username.")
            }
            else{
              const username = JSON.stringify(input)
              await AsyncStorage.setItem('username', username)
              navigation.navigate('StepCounter', {username: input})
            }
        })
        .catch((err) => {
          setShowErrorText(true);
          setErrorText("An error has occured, please try again with your Github username.")
        })
    }
}

const skipLogin = async (navigation) => {
  const username = await getUsername();

  if(username){
    navigation.navigate('StepCounter', {username: await getUsername()});
  }
}

const getUsername = async () => {
  const jsonValue = await AsyncStorage.getItem('username');
  return jsonValue != null ? JSON.parse(jsonValue) : null
}

const styles = StyleSheet.create({
    screen: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    text: {
        fontSize: 24,
    },

    input: {
        width: '95%',
        margin: 20,
        borderWidth: 0.5,
        borderRadius: 5,
        
    },

    image: {
      height: '25%',
      width: '50%',
      marginTop: 20,
      marginBottom: 20
    },

    errorText: {
      color: '#f52f2f'
    }
  });

export default LoginScreen;