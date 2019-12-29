import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import Header from './header'
import {
  Text,
  View,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'

export default function Student() {
  const [email, setEmail] = useState('')
  const [queue, setQueue] = useState([])
  const [position, setPosition] = useState(0)
  const [numTutors, setNumTutors] = useState(0)
  const [inQueue, setInQueue] = useState(false)
  const [classCode, setClassCode] = useState('')

  useEffect(() => {
    const queueRef = firebase.database().ref('queue')
    const tutorCounterRef = firebase.database().ref('numTutors')
    const connectedRef = firebase.database().ref(".info/connected")
    const uid = firebase.auth().currentUser.uid // get uid

    tutorCounterRef.on('value', snapshot => setNumTutors(snapshot.val())) // save tutor count to state

    setEmail(firebase.auth().currentUser.email) // store email to display

    queueRef.on('value', snap => {
      const data = snap.val() && [...Object.values(snap.val())] // save queue as array

      if (data) {
        setQueue(data) // set queue data

        setInQueue(data.find((item, i) => { // check if in queue or not
          if (item.uid === uid)
            setPosition(i) // set position in queue

          return item.uid === uid // return if in queue or not
        }))
      } else {
        setQueue([]) // if there's no queue reset
        setInQueue(false) // set queue to false since no queue
      }
    })

    return () => { // disconnect from queue, numTutors and connectionRef
      queueRef.off()
      tutorCounterRef.off()
      connectedRef.off()
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header
        email={email}
        handleLogOut={() => {
          if (inQueue) // if the student is in queue..
            AsyncStorage.getItem('queueKey').then(key => {
              firebase.database().ref(`/queue/${key}`).remove() // ..remove student from queue
            })

          firebase.auth().signOut() // sign out user
          AsyncStorage.clear() // clear local storage
        }}
      />

      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 20 }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{inQueue ? 'Before you:' : 'Queued Students:'}</Text>
        </View>

        <View>
          <Text style={{ fontSize: 24 }}>{
            inQueue ? // if queued
              (position || 'You\'re next!') // display current position or "You're next!"
              :
              (queue ? queue.length : 0) // display queue length if no queue display 0
          }</Text>
        </View>


        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: inQueue ? '#f55649' : 'skyblue',
              paddingVertical: 10,
              margin: 10,
              borderRadius: 30,
              paddingHorizontal: 30,
              elevation: 4,
              shadowRadius: 2,
              shadowOpacity: .4,
              shadowColor: 'black',
              shadowOffset: { height: 4, width: 0 }
            }}
            onPress={() => {
              if (inQueue) {
                AsyncStorage.getItem('queueKey').then(key => {
                  firebase.database().ref(`/queue/${key}`).remove() // remove self from queue

                  AsyncStorage.removeItem('queueKey').then(() => { // clean up local key copy
                    console.log('Cleared queuKey')
                  })
                })
              } else {
                const key = firebase.database().ref('queue').push().key // create firebase push key
                const item = {} // create temp variable
                const { uid, email } = firebase.auth().currentUser // set user data

                item[`/queue/${key}`] = { // add student info to queue using created key
                  uid,
                  email,
                  class: classCode || 'Class not specified'
                }

                AsyncStorage.setItem('queueKey', key).then(() => { // store queue key to be deleted
                  firebase.database().ref().update(item).catch(e => console.log(e.message)) // then update queue to include new data
                })
              }
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontSize: 24 }}>
              {inQueue ? 'Remove Me' : 'Add Me'}
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            {
              inQueue ?
                'Waiting...'
                :
                'Have a question?\nAdd yourself so someone can assist you.\n\nWhich class do you need help with?'
            }
          </Text>

          {
            !inQueue &&
            <TextInput
              style={{ fontSize: 14, borderWidth: 1, borderColor: 'skyblue', padding: 4, margin: 4, marginTop: 0, borderRadius: 4, width: 120, alignSelf: 'center' }}
              keyboardType='default'
              placeholder='ex: math 333'
              maxLength={24}
              value={classCode}
              onChangeText={input => setClassCode(input)}
            />
          }

          <Text>{`There are currently ${numTutors + (numTutors === 1 ? ' tutor' : ' tutors')}`}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}