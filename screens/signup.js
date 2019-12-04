import React, { useState } from 'react'
import firebase from 'firebase'
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [errMsg, setErrMsg] = useState()
  const handleSubmit = (email, pass) => {
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(({ user }) => {
      if (user)
        AsyncStorage.setItem('uid', user.uid).then(() => {
          firebase.database().ref(`users/${user.uid}`).set({
            email,
            isStudent: navigation.state.params.isStudent
          }).catch(err => {
            console.log(err)
          })
        })
    }).catch(err => {
      if (err.message.includes('in use'))
        setErrMsg('Email already in exist')

      console.log('Error:', err.message)
    })
  }

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container} keyboardVerticalOffset={-100}>
      <Image source={require('../assets/images/qcLogo.png')} style={{ height: 100, width: 100, marginBottom: 20 }} />

      <View>
        <Text style={{ textAlign: 'center', margin: 18, fontSize: 18 }}>Sign up with qmail</Text>
      </View>

      <TextInput
        keyboardType='email-address'
        autoCompleteType='email'
        autoFocus
        style={styles.textBox}
        placeholder='Qmail'
        value={email}
        onChangeText={value => setEmail(value)}
      />

      <TextInput
        keyboardType='default'
        secureTextEntry
        style={styles.textBox}
        placeholder='Pass'
        value={pass}
        onChangeText={value => setPass(value)}
      />

      <TextInput
        keyboardType='default'
        secureTextEntry
        style={styles.textBox}
        placeholder='Confirm Pass'
        value={confirmPass}
        onChangeText={value => setConfirmPass(value)}
      />

      {
        errMsg && <View>
          <Text style={{ textAlign: 'center', color: 'red', paddingHorizontal: 20 }}>{errMsg}</Text>
        </View>
      }

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => {
          if (!email.includes('@qmail.cuny.edu') || !email.includes('@qc.cuny.edu'))
            setErrMsg('Please enter a valid Qmail')
          else if(pass !== confirmPass)
            setErrMsg('Passwords must match')
          else if (pass.length < 8)
            setErrMsg('Password must be at least 8 characters long')
          else
            handleSubmit(email, pass)
        }}
      ><Text style={{ textAlign: 'center' }}>Submit</Text></TouchableOpacity>

      <Text style={{ marginTop: 14, textAlign: 'center', padding: 12 }}>
        <Text style={{ textDecorationLine: 'underline', color: '#f55649' }}>Note</Text>

        {'\n'}Emails can only be used for only student or professor, NOT both.
      </Text>
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