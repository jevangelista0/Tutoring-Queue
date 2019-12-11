import React, { useState, useEffect } from 'react'
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

let tutorCode

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('') // email variable
  const [pass, setPass] = useState('') // pasword variable
  const [confirmPass, setConfirmPass] = useState('') // confirm password variable
  const [errMsg, setErrMsg] = useState() // error message variable
  const [code, setCode] = useState('') // tutor passcode
  const handleSubmit = (email, pass) => { // create a user
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(({ user }) => {
      if (user) {
        user.sendEmailVerification().then(() => { // send email verification uppon sign up
          console.log('Verification email sent')
        }).catch(e => {
          console.log(e)
        })

        firebase.database().ref(`users/${user.uid}`).set({ // store the email and if isStudent
          email,
          isStudent: navigation.state.params.isStudent
        }).catch(err => {
          console.log(err)
        })
      }
    }).catch(err => {
      if (err.message.includes('in use')) // let user know if email already used
        setErrMsg('Email already exists')

      console.log('Error:', err.message)
    })
  }

  useEffect(() => {
    firebase.database().ref('code').once('value', snap => tutorCode = snap.val())
  }, [])

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container} keyboardVerticalOffset={-100}>
      <Image source={require('../assets/images/qcLogo.png')} style={{ height: 100, width: 100, marginBottom: 20 }} />

      <View>
        <Text style={{ textAlign: 'center', margin: 18, fontSize: 18 }}>Sign up with Qmail</Text>
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
        onChangeText={value => {
          setPass(value)

          if (value.length > 18) // to handle autfill inputs
            setConfirmPass(value)
        }}
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

      {
        !navigation.state.params.isStudent &&
        <View style={{ alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', paddingTop: 8 }}>
            Please input the provided tutor code
          </Text>

          <TextInput
            secureTextEntry
            placeholder='Tutor Passcode'
            onChangeText={input => setCode(input)}
            style={styles.textBox}
            vaule={code}
          />
        </View>
      }

      <TouchableOpacity
        style={styles.textBox}
        onPress={() => {
          if (!(email.includes('@qmail.cuny.edu') || email.includes('@qc.cuny.edu'))) // confirm email is qmail
            setErrMsg('Please enter a valid Qmail')
          else if (pass !== confirmPass) // confirm if passwords are equal
            setErrMsg('Passwords must match')
          else if (pass.length < 8) // confirm min length for password
            setErrMsg('Password must be at least 8 characters long')
          else if (code !== tutorCode)
            setErrMsg('Don\'t forget the passcode (:')
          else // submit and process if reuiqrements filled
            handleSubmit(email, pass)
        }}
      ><Text style={{ textAlign: 'center' }}>Submit</Text></TouchableOpacity>

      <View>
        <Text style={{ marginTop: 14, textAlign: 'center', padding: 12 }}>
          <Text style={{ textDecorationLine: 'underline', color: '#f55649' }}>Note</Text>

          {'\n'}Emails can only be used for only student or professor, NOT both.
      </Text>
      </View>
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