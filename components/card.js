import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

export default function Card({ data, handleChecked, isFirst, hours }) { // 3 params: student data, delete student function, is first in queue
  const studentName = data.email.substring(0, data.email.indexOf('.')) + ' ' + data.email.substring(data.email.indexOf('.'), (data.email.indexOf('.') + 2)).toUpperCase()

  if (data) // if data exists return something
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontSize: 16, maxWidth: 248 /*color: '#fff'*/ }}>{studentName + ' · ' + data.class + ' '}</Text>

          {
            <Text style={{ fontSize: 16, color: 'lightgrey' }}>
              {
                (hours.min === 0 && hours.hr === 0) || !('hr' in hours) ? '0.00hrs' : (hours.hr + (hours.min / 60)).toFixed(2) + 'hrs'
              }
            </Text>
          }
        </View>

        {
          isFirst && // display button only for first student
          <TouchableOpacity
            style={{ backgroundColor: 'skyblue', height: 20, width: 20, padding: 2, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => handleChecked()} // handles deleted students
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

  return <View /> // if no data return empty view
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