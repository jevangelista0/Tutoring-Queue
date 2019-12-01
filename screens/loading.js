import React, { useEffect } from 'react'
import { StyleSheet, View, Animated, AsyncStorage } from 'react-native'
import firebase from 'firebase'
import { firebaseInit } from '../env.json'

export default function Loading({ navigation }) {
  const opacity = new Animated.Value(0)

  useEffect(() => {
    firebase.initializeApp(firebaseInit)

    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 1500
      }
    ).start(() => {
      firebase.auth().onAuthStateChanged(user => {
        if (user)
          verify()
        else
          navigation.navigate('Login')
      })
    })
  }, [])

  const verify = () => {
    AsyncStorage.getItem('uid').then(uid => {
      if(uid === firebase.auth().currentUser.uid)
        navigation.navigate('Home', { uid })
      else {
        firebase.auth().signOut()
        AsyncStorage.clear()
      }
    })
  }

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