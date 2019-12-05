import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import firebase from 'firebase'
import { Feather } from '@expo/vector-icons';
import Card from '../components/card'
import Timer from '../components/timer'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  StatusBar,
  FlatList,
  // TextInput,
  // KeyboardAvoidingView
} from 'react-native'

const padTop = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight

export default function HomeScreen() {
  const [isStudent, setIsStudent] = useState(true)
  const [queue, setQueue] = useState([])

  const [email, setEmail] = useState('')
  const [localUid, setUid] = useState('')
  const [inQueue, setInQueue] = useState(false)
  const [position, setPosition] = useState(0)
  const [numTutors, setNumTutors] = useState(0)
  // const [classType, setClassType] = useState('') // handles student class number input

  const Header = () =>
    <View style={{ padding: 10, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{email.substring(0, email.indexOf('@'))}</Text>

      <Feather
        name='log-out'
        size={20}
        style={{ padding: 4, color: 'red' }}
        onPress={() => { // log out user
          if (inQueue) // if the student is in queue..
            AsyncStorage.getItem('queueKey').then(key => {
              firebase.database().ref(`/queue/${key}`).remove() // ..remove student from queue..

              AsyncStorage.removeItem('queueKey').then(() => { // ..and clean up local queue key copy
                console.log('Cleared queuKey')
              })
            })

          if (!isStudent && numTutors >= 1) // deduct online tutor
            firebase.database().ref('numTutors').set(numTutors - 1)

          firebase.auth().signOut() // sign out user
          AsyncStorage.clear() // clear local storage
        }}
      />
    </View>

  const Student = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{inQueue ? 'Before you:' : 'Queued Students:'}</Text>

        <Text style={{ fontSize: 24 }}>{inQueue ? (position || 'You\'re next!') : (queue ? queue.length : 0)}</Text>

        {/* {
          !inQueue &&
          <KeyboardAvoidingView>
            <Text style={{ textAlign: 'center', marginBottom: 4 }}>Which class?</Text>

            <TextInput
              style={{ borderWidth: 1, borderColor: 'skyblue', padding: 10, borderRadius: 4, width: 120 }}
              keyboardType='default'
              placeholder='ex: math 333'
              // maxLength={9}
              value={classType}
              onChangeText={input => setClassType(input)}
            />
          </KeyboardAvoidingView>
        } */}

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: inQueue ? '#f55649' : 'skyblue', paddingVertical: 10, margin: 10, borderRadius: 30, paddingHorizontal: 30 }}
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

                item[`/queue/${key}`] = { // add student info to queue using created key
                  uid: localUid,
                  email: firebase.auth().currentUser.email,
                  class: 'Class not specified'
                }

                AsyncStorage.setItem('queueKey', key).then(() => { // store queue key to be deleted
                  firebase.database().ref().update(item).catch(e => console.log(e.message))
                })
              }
            }}
          ><Text style={{ color: '#fff', textAlign: 'center', fontSize: 24 }}>{inQueue ? 'Remove Me' : 'Add Me'}</Text></TouchableOpacity>

          <Text style={{ fontSize: 14, textAlign: 'center', padding: 10 }}>
            {
              inQueue ?
                'Waiting...'
                :
                'Have a question?\nAdd yourself so someone can assist you.'
            }
          </Text>

          <Text>{`There are currently ${numTutors + (numTutors === 1 ? ' tutor' : ' tutors')}`}</Text>
        </View>
      </View>
    )
  }

  const Professor = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' /*backgroundColor: '#000'*/ }}>
        <View style={{ paddingVertical: 12, paddingHorizontal: 24, ...styles.elevate, width: '100%' }}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}>
            Hello, here are students who need help today with their classes:
          </Text>
        </View>

        <FlatList
          style={{ width: '100%', paddingHorizontal: 15, marginTop: 6 }}
          data={queue}
          keyExtractor={item => item.uid}
          ListEmptyComponent={() =>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 12 }}>
              No Students Have Questions Right Now.
            </Text>
          }
          renderItem={({ item, index }) =>
            <Card // create student card
              isFirst={index === 0}
              data={item} // pass student data
              handleClose={() =>
                firebase.database().ref('queue').limitToFirst(1).once('value', snap => { // get first student in queue
                  const queueKey = Object.keys(snap.val())[0] // get key of object
                  const update = {} // set temp variable

                  update[`queue/${queueKey}`] = null // delete student data

                  firebase.database().ref().update(update) // update queue
                })
              }
            />
          }
        />

        <Timer />
      </View>
    )
  }

  useEffect(() => {
    const queueRef = firebase.database().ref('queue')
    const tutorCounterRef = firebase.database().ref('numTutors')
    const connectedRef = firebase.database().ref(".info/connected")

    AsyncStorage.getItem('uid').then(uid => { // get local uid
      firebase.database().ref(`users/${uid}`).once('value', snap => { // get user data
        const data = snap.val()

        if (data) { // id data exists
          setIsStudent(data.isStudent) // set if isStudent status
          setEmail(firebase.auth().currentUser.email) // store email to display
          setUid(uid) // store uid for student queue (may not be needed b/c of queue id)

          let tutorCount = 0

          tutorCounterRef.on('value', snapshot => {
            tutorCount = snapshot.val() // save tutor count incase state is not updated
            setNumTutors(snapshot.val()) // save tutor count to state
          }) // snapshot for tutorCounter

          if (!data.isStudent) { // for tutors
            connectedRef.on("value", snapshot => { // snapshot for connectionRef
              if (snapshot.val() === true) { // increase number of tutor
                console.log('connected')
                tutorCounterRef.set(numTutors + 1)
              } else if (tutorCount >= 1) { // dunno (change to update())
                console.log('disconnected')
                tutorCounterRef.onDisconnect().set(numTutors) // update numTutors
              }
            })
          }
        }
      })

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
    })

    return () => { // stop reference to queue, numTutors and connectionRef
      queueRef.off()
      tutorCounterRef.off()
      connectedRef.off()
    }
  }, [])

  return (
    <View style={styles.container}>
      <Header />

      {
        isStudent ?
          <Student />
          :
          <Professor />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: padTop
  },
  elevate: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  }
})