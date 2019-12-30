import React from 'react'
import { StyleSheet, Image, Platform, Text, View, TouchableOpacity } from 'react-native'
import { BlurView } from 'expo-blur' // blurs image

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={Platform.OS === 'ios' ? 70 : 98} tint='light' style={{ ...StyleSheet.absoluteFill, flex: 1, zIndex: -3 }} />

      <Image
        source={require('../assets/images/qcCampus.jpg')}
        style={{ ...StyleSheet.absoluteFill, flex: 1, height: '100%', position: 'absolute', zIndex: -4 }}
      />

      <Text style={{ fontSize: 24, margin: 12, fontWeight: 'bold' }}>Welcome!</Text>

      <Text style={{ fontSize: 20, margin: 12 }}>to Math Lab Tutoring</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp', { isStudent: true })} // go to sign up page as a student
        style={{
          width: '100%',
          padding: 10,
          margin: 10,
          fontSize: 20,
          borderRadius: 4,
          backgroundColor: '#f55649'
        }}
      ><Text style={{ fontWeight: 'bold', textAlign: 'center' }}>I'm a Student</Text></TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp', { isStudent: false })} // go to sign up page as a tutor
        style={{
          width: '100%',
          padding: 10,
          borderColor: '#f55649',
          borderWidth: 1,
          margin: 10,
          fontSize: 20,
          borderRadius: 4
        }}
      ><Text style={{ fontWeight: 'bold', textAlign: 'center' }}>I'm a Tutor</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50
  },
})