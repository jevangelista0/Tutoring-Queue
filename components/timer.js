import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'

export default function Timer({ useActive, onStop, initTime }) {
  const [sec, setSec] = useState(0) // seconds variable
  const [min, setMin] = useState(0) // minutes variable 
  const [hr, setHr] = useState(0) // hours variable
  const [isActive, setIsActive] = useActive()

  useEffect(() => { // updates states when isActive changes or seconds keep changing
    let interval = null // timer handler variable

    if (isActive) { // if timer is started
      interval = setInterval(() => { // set timer handler
        setSec(parseInt((new Date() - initTime) / 1000) % 60) // increment seconds

        setMin(parseInt((((new Date() - initTime) / 1000) / 60) % 60)) // increment minutes

        setHr(parseInt(((((new Date() - initTime) / 1000) / 60) / 24) % 24)) // increment hours
      }, 1000)
    } else if (!isActive && sec !== 0) { // else stop timer
      clearInterval(interval)
    }

    return () => clearInterval(interval) // clear timer (interval) for clean up
  }, [isActive, sec])

  return (
    <View style={{ alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderColor: 'skyblue' }}>
      <Text style={{ marginBottom: 8, fontSize: 18 }}>
        {hr > 9 ? hr : ('0' + hr)}h : {min > 9 ? min : ('0' + min)}m : {sec > 9 ? sec : ('0' + sec)}s
      </Text>

      <View 
        style={{ flexDirection: 'row', width: 200, justifyContent: 'space-evenly', display: isActive || sec > 0 || min > 0 || hr > 0 ? 'flex' : 'none' }}
      >
        <TouchableOpacity
          style={{ borderRadius: 4, backgroundColor: 'skyblue', padding: 8 }}
          onPress={() => { // toggle
            /**
             * save new date
             * subtract old date from new date and divide by 1000 to get secs
             * get mins and divide by 60
             * get hrs and divide by 24
             */
            setIsActive(!isActive)
          }}
        ><Text style={{ color: '#fff', fontSize: 18 }}>{isActive ? 'Pause' : 'Resume'}</Text></TouchableOpacity>

        <TouchableOpacity
          style={{ borderRadius: 4, borderColor: 'skyblue', borderWidth: 1, padding: 8 }}
          onPress={() => { // reset timer
            onStop(sec, min, hr)
            setSec(0)
            setMin(0)
            setHr(0)
          }}
        ><Text style={{ fontSize: 18 }}>Done</Text></TouchableOpacity>
      </View>

      <Text style={{ margin: 8, textAlign: 'center', fontSize: 14, paddingHorizontal: 12 }}>
        Timer is used to keep track of student's sessions.
      </Text>
    </View>
  )
}