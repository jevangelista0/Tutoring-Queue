import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

export default function Card({ data, handleFinished, isFirst }) { // 3 params: student data, delete student function, is first in queue
  if (data) // if data exists return something
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, /*color: '#fff'*/ }}>{data.email.substring(0, data.email.indexOf('@')) + ' · ' + data.class}</Text>

        {
          isFirst && // display button only for first student
          <TouchableOpacity
            style={{ backgroundColor: 'skyblue', height: 20, width: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => handleFinished()} // handles deleted students
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

  // if no data return empty view
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
    elevation: 4,
    shadowRadius: 2,
    shadowOpacity: .4,
    shadowColor: 'black',
    shadowOffset: { height: 4, width: 4 }
  }
})