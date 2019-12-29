import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import Student from '../components/student'
import Tutor from '../components/tutor'
import { View } from 'react-native'

export default function HomeScreen() {
  const [isStudent, setIsStudent] = useState()

  useEffect(() => {
    const uid = firebase.auth().currentUser.uid
    
    firebase.database().ref(`users/${uid}/isStudent`).once('value', snap => setIsStudent(snap.val()))
  }, [])

  if (isStudent === undefined)
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />
  else {
    if (isStudent)
      return <Student />
    else
      return <Tutor />
  }
}
