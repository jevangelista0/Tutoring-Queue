import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

export default function Card({ data, handleClose, isFirst }) {
  if (data)
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, /*color: '#fff'*/ }}>{data.email.substring(0, data.email.indexOf('@')) + ' · ' + data.class}</Text>

        {
          isFirst &&
          <TouchableOpacity
            style={{ backgroundColor: 'skyblue', height: 20, width: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => handleClose()}
          >
            <Feather
              name='check'
              color='#fff'
              size={15}
            />
          </TouchableOpacity>
        }
      </View>
    )

  return <View />
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'skyblue',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#fff',
    shadowRadius: 2,
    shadowOpacity: .4,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 4 }
  }
})