import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import firebase from 'firebase'
import { Feather } from '@expo/vector-icons';
import Card from '../components/card'
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
        onPress={() => {
          if (inQueue)
            AsyncStorage.getItem('queueKey').then(key => {
              firebase.database().ref(`/queue/${key}`).remove()

              AsyncStorage.removeItem('queueKey').then(() => { // clean up local key copy
                console.log('Cleared queuKey')
              })
            })

          if (!isStudent && numTutors >= 1)
            firebase.database().ref('numTutors').set(numTutors - 1)

          firebase.auth().signOut()
          AsyncStorage.clear()
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
                  firebase.database().ref(`/queue/${key}`).remove()

                  AsyncStorage.removeItem('queueKey').then(() => { // clean up local key copy
                    console.log('Cleared queuKey')
                  })
                })
              } else {
                const key = firebase.database().ref('queue').push().key
                const item = {}

                item[`/queue/${key}`] = {
                  uid: localUid,
                  email: firebase.auth().currentUser.email,
                  class: 'Class not specified'
                }

                AsyncStorage.setItem('queueKey', key).then(() => {
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
            <Text style={{ textAlign: 'center', fontWeight: 'bold', marginVertical: 12 }}>No Students Have Questions Right Now.</Text>
          }
          renderItem={({ item, index }) =>
            <Card
              isFirst={index === 0}
              data={item}
              handleClose={() =>
                firebase.database().ref('queue').limitToFirst(1).once('value', snap => {
                  const queueKey = Object.keys(snap.val())[0]
                  const update = {}

                  update[`queue/${queueKey}`] = null

                  firebase.database().ref().update(update)
                })
              }
            />
          }
        />
      </View>
    )
  }

  useEffect(() => {
    const queueRef = firebase.database().ref('queue')
    const tutorCounterRef = firebase.database().ref('numTutors')
    const connectedRef = firebase.database().ref(".info/connected")

    AsyncStorage.getItem('uid').then(uid => {
      firebase.database().ref(`users/${uid}`).once('value', snap => {
        const data = snap.val()

        if (data) {
          setIsStudent(data.isStudent)
          setEmail(firebase.auth().currentUser.email)
          setUid(uid)
          
          let tutorCount = 0

          tutorCounterRef.on('value', snapshot => {
            tutorCount = snapshot.val()
            setNumTutors(snapshot.val())
          }) // snapshot for tutorCounter

          if (!data.isStudent) {
            connectedRef.on("value", snapshot => { // snapshot for connectionRef
              if (snapshot.val() === true) {
                console.log('connected')
                tutorCounterRef.set(numTutors + 1)
              } else if (tutorCount >= 1) {
                console.log('disconnected')
                tutorCounterRef.onDisconnect().set(numTutors)
              }
            })
          }
        }
      })
      
      queueRef.on('value', snap => {
        const data = snap.val() && [...Object.values(snap.val())]
        
        if (data) {
          setQueue(data)
          
          setInQueue(data.find((item, i) => {
            if (item.uid === uid)
            setPosition(i)
            
            return item.uid === uid
          }))
        } else {
          setQueue([])
          setInQueue(false)
        }
      })
    })

    return () => {
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