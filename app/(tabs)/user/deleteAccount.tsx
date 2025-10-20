import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { MaterialIcons } from '@expo/vector-icons';

export default function deleteAccount() {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View className='flex-column' style={{minHeight: "100%"}}>
          <Navbar title='Delete your account' />
          <View className='flex-1' style={{height: "100%"}}>
            <View className='flex-row items-center gap-3' style={{paddingTop: "10%"}}>
              <MaterialIcons name="dangerous" size={30} color={theme.red_button} />
              <Text className='text-xl font-bold'>CAUTION:</Text>
            </View>
            <Text className='mt-5' style={{fontSize: 15}}>
              If you delete account, Your data will not be retrevied!
            </Text>
            <View className='pt-14'>
              <TouchableOpacity style={{backgroundColor: theme.red_button}} className='flex-row items-center justify-center p-2 rounded-md'>
                <Text className='text-lg text-white font-bold'>DELETE ACCOUNT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>      
  )
}