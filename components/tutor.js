import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import Card from '../components/card'
import Timer from '../components/timer'
import Header from '../components/header'
import { StyleSheet, Text, View, FlatList, Animated } from 'react-native'

export default function Tutor() {
  const [opacity] = useState(new Animated.Value(0))
  const [email, setEmail] = useState('')
  const [queue, setQueue] = useState([])
  const [numTutors, setNumTutors] = useState(0)

  useEffect(() => {
    const queueRef = firebase.database().ref('queue')
    const tutorCounterRef = firebase.database().ref('numTutors')
    const connectedRef = firebase.database().ref(".info/connected")
    const uid = firebase.auth().currentUser.uid // get uid

    tutorCounterRef.on('value', snapshot => setNumTutors(snapshot.val())) // save tutor count to state

    firebase.database().ref(`users/${uid}`).once('value', snap => { // get user data based on uid
      const data = snap.val()

      if (data) { // user data exists
        setEmail(firebase.auth().currentUser.email) // store email to display

        connectedRef.on("value", snapshot => {
          if (snapshot.val() === true) { // add tutor
            console.log('connected')
            tutorCounterRef.set(numTutors + 1)
          } else { // remove tutor
            console.log('disconnected')
            tutorCounterRef.onDisconnect().set(numTutors - 1)
          }
        })
      }
    })

    queueRef.on('value', snap => {
      const data = snap.val() && [...Object.values(snap.val())] // save queue as array

      if (data)
        setQueue(data) // set queue data
      else
        setQueue([]) // if there's no queue reset
    })

    Animated.timing(
      opacity,
      {
        toValue: 1,
        duration: 250
      }
    ).start()

    return () => { // disconnect from queue, numTutors and connectionRef
      queueRef.off()
      tutorCounterRef.off()
      connectedRef.off()
    }
  }, [])

  return (
    <Animated.View style={{ flex: 1, backgroundColor: '#fff', opacity }}>
      <Header
        email={email}
        handleLogOut={function () {
          firebase.database().ref('numTutors').set(numTutors - 1)
          firebase.auth().signOut() // sign out user
        }}
      />

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
              handleFinished={() =>
                firebase.database().ref('queue').limitToFirst(1).once('value', snap => { // get first student, the..
                  const queueKey = Object.keys(snap.val())[0] // ..first key in object
                  const update = {} // set temp variable

                  update[`queue/${queueKey}`] = null // set to null to delete

                  firebase.database().ref().update(update) // update queue to delete data from queue
                })
              }
            />
          }
        />

        <Timer />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
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