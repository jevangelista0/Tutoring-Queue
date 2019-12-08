import React, { useState } from 'react'
import firebase from 'firebase'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

export default function Test() {
  const [isEmailSent, setIsEmailSent] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: '#000', padding: 30 }]}>
        Thanks for signing up!{'\n'}Please check your email to verify your account.
      </Text>

      <View style={{ padding: 12, justifyContent: 'space-evenly' }}>
        <TouchableOpacity
          disabled={isEmailSent}
          style={[styles.button, { backgroundColor: isEmailSent ? '#cecece' : 'skyblue' }]}
          onPress={() => {
            setIsEmailSent(true)

            firebase.auth().currentUser.sendEmailVerification().then(() => {
              setTimeout(() => setIsEmailSent(false), 4000)

              console.log('Verification email sent')
            }).catch(e => {
              console.log(e)
            });
          }}
        >
          <Text style={styles.text}>{isEmailSent ? 'Email Sent!' : 'Send Email Again'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => firebase.auth().signOut()}
        >
          <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24
  },
  button: {
    backgroundColor: '#f55649',
    paddingVertical: 10,
    margin: 10,
    borderRadius: 30,
    paddingHorizontal: 30,
    elevation: 4,
    shadowRadius: 2,
    shadowOpacity: .4,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 0 }
  }
})