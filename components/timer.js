import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

export default function Timer() {
  const [sec, setSec] = useState(0) // seconds variable
  const [min, setMin] = useState(0) // minutes variable 
  const [hr, setHr] = useState(0) // hours variable
  const [isActive, setIsActive] = useState(false) // if timer is active or not

  useEffect(() => { // updates states when isActive changes or seconds keep changing
    let interval = null // timer handler variable
    
    if (isActive) { // if timer is started
      interval = setInterval(() => { // set timer handler
        if (sec === 59) { // reset to 0 for 60
          setSec(0)

          if (min === 59) { // reset to 0 for 60
            setMin(0)

            if (hr === 59) // reset to 0 for 60
              setHr(0)
            else
              setHr(hr => hr + 1) // increment seconds
          } else
            setMin(min => min + 1) // increment minutes
        } else
          setSec(sec => sec + 1) // increment hours
      }, 1000)
    } else if (!isActive && sec !== 0) { // else stop timer
      clearInterval(interval)
    }

    return () => clearInterval(interval) // clear timer (interval) for clean up
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
            setSec(0) // reset timer
            setMin(0) // reset timer
            setHr(0) // reset timer
            setIsActive(false) // reset timer
          }}
        ><Text style={{ fontSize: 18 }}>Reset</Text></TouchableOpacity>
      </View>

      <Text style={{ margin: 8, textAlign: 'center', fontSize: 14, paddingHorizontal: 12 }}>
        Use the timer to keep track of your sessions with students.
      </Text>
    </View>
  )
}