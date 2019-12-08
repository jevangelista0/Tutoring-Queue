import React, { useState } from 'react'
import firebase from 'firebase'
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity
} from 'react-native'

export default function Login({ navigation }) {
  const [email, setEmail] = useState('') // email variable
  const [pass, setPass] = useState('') // pasword variable
  const [errMsg, setErrMsg] = useState() // error message variable
  const handleInput = (email, pass) => { // handle input to log in user
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(err => {
      if (err.message)
        setErrMsg('Please check and try the email or password again') // update error message for user

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
        onChangeText={value => setEmail(value)} // set email onChange
      />

      <TextInput
        keyboardType='default'
        style={styles.textBox}
        secureTextEntry
        placeholder='Pass'
        value={pass}
        onChangeText={value => setPass(value)} // set password onChange
      />

      { // show error message to user
        errMsg && <View>
          <Text style={{ textAlign: 'center', color: 'red', paddingHorizontal: 20 }}>{errMsg}</Text>
        </View>
      }

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => {
          if (!(email.includes('@') && email.includes('.'))) // check if valid email
            setErrMsg('Please enter a valid email')
          else if (pass.length < 8) // check if password has at least length 8
            setErrMsg('Password must be at least 8 characters long')
          else // log in user if no errors
            handleInput(email, pass)
        }}
      ><Text style={{ textAlign: 'center' }}>Log In</Text></TouchableOpacity>

      <View style={{ alignItems: 'flex-end', width: '100%' }}>
        <Text
          style={{ color: 'grey', textAlign: 'right', padding: 8 }}
          onPress={() => {
            if (!email) {
              setErrMsg('Enter an email to reset password')

              return
            }

            firebase.auth().sendPasswordResetEmail(email).then(() => {
              setErrMsg('EMAIL SENT!')

              setTimeout(() => setErrMsg(undefined), 5000)
            }).catch(() => setErrMsg('The account may not exist or is not a valid Qmail'))
          }}
        >Forgot password?</Text>
      </View>

      <View style={{ borderWidth: .5, borderColor: '#f55649', marginVertical: 12, width: '100%' }} />

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => navigation.navigate('Welcome')} // navigate to welcome screen to ask if student or professor
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