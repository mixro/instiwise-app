import { View, Text, KeyboardAvoidingView, Platform, Dimensions, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import ArrayInput from '@/src/components/ui/ArrayInput';
const { height } = Dimensions.get('window');

export default function create() {
  const { theme } = useTheme();  
  const [inputs, setInputs] = useState({
      title: '',
      desc: '',
      category: '',
      problem: '', 
      duration: '',
      status: '',
  });
  const [arrayValues, setArrayValues] = useState({
    goals: '',
    scope: '',
    budget: '',
    resources: '',
    challenges: '',
    plan: '',
  });
  const [arrays, setArrays] = useState({
    goals: [] as string[],
    scope: [] as string[],
    budget: [] as string[],
    resources: [] as string[],
    challenges: [] as string[],
    plan: [] as string[],
  });

  const handleChange = (key: string, value: string) => {
    setInputs((prev) => ({
      ...prev, [key]: value
    }));
  };

  const updateArrayValue = (key: string, value: string) => {
    setArrayValues((prev) => ({
      ...prev, [key]: value
    }));
  };

  const updateArray = (key: string, newArray: React.SetStateAction<string[]>) => {
    setArrays((prev) => ({
      ...prev,
      [key]: typeof newArray === 'function' ? newArray(prev[key as keyof typeof prev]) : newArray
    }));
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.wrapper}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Navbar title='CREATE NEW PROJECT' />
          <View className='pb-7'>
            <View>
              <View className='pt-6'>
                <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Title</Text>
                  <TextInput
                      className='py-3 font-medium'
                      value={inputs.title}
                      onChangeText={(text) => handleChange('title', text)}
                      style={styles.input}
                      placeholder={"Project title"}
                      placeholderTextColor="#494949ff"
                  />
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Profile picture</Text>
                  <View className='flex-1 flex-row gap-4 items-center py-3 justify-center rounded-md' style={{backgroundColor: theme.blue_text}}>
                      <Text className='font-bold text-white'>UPLOAD IMAGE</Text>
                      <Ionicons name="image" size={24} color="white" />
                  </View>
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Description</Text>
                  <TextInput
                      className='py-3 font-medium'
                      value={inputs.desc}
                      onChangeText={(text) => handleChange('desc', text)}
                      placeholder="Project description"
                      placeholderTextColor="#494949ff"
                      multiline
                      numberOfLines={5} 
                      style={styles.textArea}
                      textAlignVertical="top"
                  />
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Category</Text>
                  <TextInput
                      className='py-3 font-medium'
                      value={inputs.category}
                      onChangeText={(text) => handleChange('category', text)}
                      style={styles.input}
                      placeholder={"Project category"}
                      placeholderTextColor="#494949ff"
                  />
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Problem solved</Text>
                  <TextInput
                      className='py-3 font-medium'
                      value={inputs.problem}
                      onChangeText={(text) => handleChange('problem', text)}
                      style={styles.input}
                      placeholder={"Project problem"}
                      placeholderTextColor="#494949ff"
                  />
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Duration</Text>
                  <TextInput
                      className='py-3 font-medium'
                      value={inputs.duration}
                      onChangeText={(text) => handleChange('duration', text)}
                      style={styles.input}
                      placeholder={"Project duration"}
                      placeholderTextColor="#494949ff"
                  />
              </View>
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Status</Text>
                  <View style={styles.select}>
                    <Picker
                      selectedValue={inputs.status}
                      onValueChange={(itemValue) => handleChange('status', itemValue)}
                      style={[{borderRadius: 5}, styles.input]}
                      className='font-medium'
                    >
                      <Picker.Item label="Select category" value="" />
                      <Picker.Item label="Completed" value="completed" />
                      <Picker.Item label="In Progress" value="in progress" />
                      <Picker.Item label="On Hold" value="on hold" />
                    </Picker>
                  </View>
              </View>
            </View>
            
            <View className='py-3'>
              <ArrayInput
                label="Goals"
                value={arrayValues.goals}
                setValue={(value) => updateArrayValue('goals', value)}
                array={arrays.goals}
                setArray={(newArray) => updateArray('goals', newArray)} // Updated to pass newArray directly
                theme={theme}
              />
              <ArrayInput
                label="Plan"
                value={arrayValues.plan}
                setValue={(value) => updateArrayValue('plan', value)}
                array={arrays.plan}
                setArray={(newArray) => updateArray('plan', newArray)}
                theme={theme}
              />
              <ArrayInput
                label="Scope"
                value={arrayValues.scope}
                setValue={(value) => updateArrayValue('scope', value)}
                array={arrays.scope}
                setArray={(newArray) => updateArray('scope', newArray)}
                theme={theme}
              />
              <ArrayInput
                label="Budget"
                value={arrayValues.budget}
                setValue={(value) => updateArrayValue('budget', value)}
                array={arrays.budget}
                setArray={(newArray) => updateArray('budget', newArray)}
                theme={theme}
              />
              <ArrayInput
                label="Resources"
                value={arrayValues.resources}
                setValue={(value) => updateArrayValue('resources', value)}
                array={arrays.resources}
                setArray={(newArray) => updateArray('resources', newArray)}
                theme={theme}
              />
              <ArrayInput
                label="Challenges"
                value={arrayValues.challenges}
                setValue={(value) => updateArrayValue('challenges', value)}
                array={arrays.challenges}
                setArray={(newArray) => updateArray('challenges', newArray)}
                theme={theme}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>    
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdfdfdff',
    minHeight: height
  },
  wrapper: {
    flex: 1
  },
  input: {
    backgroundColor: "#e6e6e6ff",
    borderRadius: 5,
    paddingLeft: 10,
  },
  select: {
    backgroundColor: "#e6e6e6ff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e6e6e6ff',
    overflow: 'hidden',
  },
  addIcon: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  textArea: {
    backgroundColor: "#e6e6e6ff",
    borderRadius: 5,
    padding: 10,
    minHeight: 120,
  },
})