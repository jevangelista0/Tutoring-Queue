import React, { useState } from 'react'
import firebase from 'firebase'
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  AsyncStorage,
  TouchableOpacity
} from 'react-native'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [errMsg, setErrMsg] = useState()
  const handleInput = (email, pass) => {
    firebase.auth().signInWithEmailAndPassword(email, pass).then(({ user }) => {
      if (user)
        AsyncStorage.setItem('uid', user.uid).then(() => {
          navigation.navigate('Home')
        })
    }).catch(err => {
      if (err.message)
        setErrMsg('Please check and try the email or password again')

      console.log('Error:', err.message)
    })
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container} keyboardVerticalOffset={-100}>
      <Image source={require('../assets/images/qcLogo.png')} style={{ height: 100, width: 100, marginBottom: 20 }} />

      <View>
        <Text style={{ textAlign: 'center', margin: 18, fontSize: 18 }}>Log in with Qmail</Text>
      </View>

      <TextInput
        keyboardType='email-address'
        autoCompleteType='email'
        style={styles.textBox}
        placeholder='Qmail'
        value={email}
        onChangeText={value => setEmail(value)}
      />

      <TextInput
        keyboardType='default'
        style={styles.textBox}
        secureTextEntry
        placeholder='Pass'
        value={pass}
        onChangeText={value => setPass(value)}
      />

      {
        errMsg && <View>
          <Text style={{ textAlign: 'center', color: 'red', paddingHorizontal: 20 }}>{errMsg}</Text>
        </View>
      }

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => {
          if (!(email.includes('@') && email.includes('.')))
            setErrMsg('Please enter a valid email')
          else if (pass.length < 8)
            setErrMsg('Password must be at least 8 characters long')
          else
            handleInput(email, pass)
        }}
      ><Text style={{ textAlign: 'center' }}>Log In</Text></TouchableOpacity>

      <View style={{ borderWidth: .5, borderColor: '#f55649', marginVertical: 12, width: '100%' }} />

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => navigation.navigate('Welcome')}
      ><Text style={{ textAlign: 'center' }}>Sign Up</Text></TouchableOpacity>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  textBox: {
    width: '100%',
    padding: 10,
    borderColor: '#cecece',
    borderWidth: .5,
    margin: 10,
    fontSize: 16,
    borderRadius: 4
  }
})