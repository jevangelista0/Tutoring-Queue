import React, { useEffect } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import firebase from 'firebase'
import { firebaseConfig } from '../env.json'

export default function Loading({ navigation }) {
  const opacity = new Animated.Value(0) // variable for opacity animation

  useEffect(() => { // initialize component
    firebase.initializeApp(firebaseConfig) // set firebase config

    Animated.timing( // logo animation
      opacity,
      {
        toValue: 1,
        duration: 1500
      }
    ).start(() => {
      firebase.auth().onAuthStateChanged(user => 
        navigation.navigate(user ? (user.emailVerified ? 'App' : 'Verify') : 'Auth')
      ) // handle user
    })
  }, [])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/qcLogo.png')}
        style={{ height: 100, width: 100, alignSelf: 'center', opacity, tintColor: '#fff' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});