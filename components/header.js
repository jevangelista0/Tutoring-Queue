import React from 'react'
import { Feather } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { Text, View, Platform, StatusBar } from 'react-native'

const padTop = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight

export default function Header({ email, handleLogOut }) {
  return (
    <View style={{ padding: 10, marginTop: padTop, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{email.substring(0, email.indexOf('@'))}</Text>

      <Feather
        name='log-out'
        size={20}
        style={{ padding: 4, color: 'red' }}
        onPress={() => handleLogOut()}
      />
    </View>
  )
}