import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

export default function Timer() {
  const [sec, setSec] = useState(0)
  const [min, setMin] = useState(0)
  const [hr, setHr] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    
    if (isActive) {
      interval = setInterval(() => {
        if (sec === 59) {
          setSec(0)

          if (min === 59) {
            setMin(0)

            if (hr === 59)
              setHr(0)
            else
              setHr(hr => hr + 1)
          } else
            setMin(min => min + 1)
        } else
          setSec(sec => sec + 1)
      }, 1000)
    } else if (!isActive && sec !== 0) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isActive, sec])

  return (
    <View style={{ alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderColor: 'skyblue' }}>
      <Text style={{ marginBottom: 8, fontSize: 18 }}>
        {hr > 10 ? hr : ('0' + hr)}h : {min > 10 ? min : ('0' + min)}m : {sec > 10 ? sec : ('0' + sec)}s
      </Text>

      <View style={{ flexDirection: 'row', width: 200, justifyContent: 'space-evenly' }}>
        <TouchableOpacity
          style={{ borderRadius: 4, backgroundColor: 'skyblue', padding: 8 }}
          onPress={() => setIsActive(!isActive)} // toggle
        ><Text style={{ color: '#fff', fontSize: 18 }}>{isActive ? 'Pause' : 'Start'}</Text></TouchableOpacity>

        <TouchableOpacity
          style={{ borderRadius: 4, borderColor: 'skyblue', borderWidth: 1, padding: 8 }}
          onPress={() => {
            setSec(0)
            setMin(0)
            setHr(0)
            setIsActive(false)
          }}
        ><Text style={{ fontSize: 18 }}>Reset</Text></TouchableOpacity>
      </View>

      <Text style={{ margin: 8, textAlign: 'center', fontSize: 14, paddingHorizontal: 12 }}>
        Use the timer to keep track of your sessions with students.
      </Text>
    </View>
  )
}