import { View, Text } from 'react-native'
import React from 'react'
import { calendarEvents } from '@/src/static/dummyData'

export default function EventCard({ event }: { event: (typeof calendarEvents)[0] }) {
  return (
    <View>
      <Text>{event.title}</Text>
    </View>
  )
}