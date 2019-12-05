import React from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import { BlurView } from 'expo-blur'

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      {/* BlurView blurs the image */}
      <BlurView intensity={70} tint='light' style={{ ...StyleSheet.absoluteFill, zIndex: -4 }}>
        <Image source={require('../assets/images/qcCampus.jpg')} style={{ height: '100%', width: '100%', position: 'absolute', zIndex: -4 }} />
      </BlurView>

      <Text style={{ fontSize: 20, margin: 12, fontWeight: 'bold' }}>Welcome!</Text>

      <Text style={{ fontSize: 16, margin: 12 }}>to Math Lab Tutoring</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp', { isStudent: true })} // go to sign up page as a student
        style={{
          width: '100%',
          padding: 10,
          margin: 10,
          fontSize: 16,
          borderRadius: 4,
          backgroundColor: '#f55649'
        }}
      ><Text style={{ textAlign: 'center' }}>I'm a Student</Text></TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp', { isStudent: false })} // go to sign up page as a non-student
        style={{
          width: '100%',
          padding: 10,
          borderColor: '#f55649',
          borderWidth: 1,
          margin: 10,
          fontSize: 16,
          borderRadius: 4
        }}
      ><Text style={{ textAlign: 'center' }}>I'm a Professor</Text></TouchableOpacity>
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