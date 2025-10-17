import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function News() {
  return (
   <SafeAreaView>
     <View className='w-[100%] h-[100%] bg-red-500'>
      <Text>News</Text>
    </View>
   </SafeAreaView>
  )
}