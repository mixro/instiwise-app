import { View, Text, KeyboardAvoidingView, Platform, Dimensions, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import ArrayInput from '@/src/components/ui/ArrayInput';
import { ImageAsset, useImageUpload } from '@/src/hooks/useImageUpload';
import { useCreateProjectMutation } from '@/src/services/projectsApi';
const { height } = Dimensions.get('window');

export default function create() {
  const { theme } = useTheme();  
  const [createProject, { isLoading: submitting }] = useCreateProjectMutation();
  const { pickImage, uploadImage, uploading, progress } = useImageUpload();

  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);

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
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const updateArrayValue = (key: string, value: string) => {
    setArrayValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateArray = (key: string, newArray: React.SetStateAction<string[]>) => {
    setArrays((prev) => ({
      ...prev,
      [key]: typeof newArray === 'function' ? newArray(prev[key as keyof typeof prev]) : newArray
    }));
  };

  const handleSelectImage = async () => {
    const asset = await pickImage();
    if (asset) {
      setSelectedImage(asset);
    }
  };

  const handleSubmit = async () => {
    if (!inputs.title || !inputs.desc || !selectedImage) {
      Alert.alert('Error', 'Title, description, and image are required');
      return;
    }

    // Step 1: Upload image
    const uploadResult = await uploadImage(selectedImage!);
    if (!uploadResult) {
      Alert.alert('Upload Failed', 'Could not upload image');
      return;
    }

    // Step 2: Create project
    try {
      await createProject({
        title: inputs.title,
        description: inputs.desc,
        img: uploadResult.url,
        category: inputs.category,
        problem: inputs.problem,
        duration: inputs.duration,
        status: inputs.status || 'in progress',
        goals: arrays.goals,
        scope: arrays.scope,
        budget: arrays.budget,
        resources: arrays.resources,
        challenges: arrays.challenges,
        plan: arrays.plan,
      }).unwrap();

      Alert.alert('Success', 'Project created successfully!', [{ text: 'OK' }]);

      // Reset
      setInputs({ title: '', desc: '', category: '', problem: '', duration: '', status: '' });
      setSelectedImage(null);
      setArrays({ goals: [], scope: [], budget: [], resources: [], challenges: [], plan: [] });
    } catch (error: any) {
      Alert.alert('Error', error.data?.message || 'Failed to create project');
    }
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
            {/* Title */}
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

              {/* Image Upload */}
              <View className='pt-6'>
                  <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Project image</Text>
                  
                  <TouchableOpacity
                    onPress={handleSelectImage}
                    disabled={uploading}
                    style={{
                      backgroundColor: theme.blue_text,
                      padding: 12,
                      borderRadius: 8,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {uploading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Text className='font-bold text-white'>SELECT IMAGE</Text>
                        <Ionicons name="image" size={24} color="white" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Local Preview */}
                  {selectedImage && !uploading && (
                    <View className="mt-4">
                      <Text className="text-sm mb-2" style={{ color: theme.text }}>Preview:</Text>
                      <Image
                        source={{ uri: selectedImage.uri }}
                        style={{ width: '100%', height: 200, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {/* Upload Progress */}
                  {uploading && (
                    <View className="mt-4">
                      <Text className="text-sm mb-2" style={{ color: theme.text }}>Uploading image...</Text>
                      <View style={{ height: 6, backgroundColor: '#ddd', borderRadius: 3, overflow: 'hidden' }}>
                        <View
                          style={{
                            height: '100%',
                            width: `${progress}%`,
                            backgroundColor: theme.green_text,
                          }}
                        />
                      </View>
                      <Text className="text-xs mt-1" style={{ color: theme.text }}>{progress}%</Text>
                    </View>
                  )}
              </View>

              {/* Description */}
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

              {/* Category */}
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

              {/* Problem */}
              <View className='pt-6'>
                <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Problem Solved</Text>
                <TextInput
                  className='py-3 font-medium'
                  value={inputs.problem}
                  onChangeText={(text) => handleChange('problem', text)}
                  style={styles.input}
                  placeholder="What problem does this solve?"
                  placeholderTextColor="#494949"
                />
              </View>
  
              {/* Duration */}
              <View className='pt-6'>
                <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Duration</Text>
                <TextInput
                  className='py-3 font-medium'
                  value={inputs.duration}
                  onChangeText={(text) => handleChange('duration', text)}
                  style={styles.input}
                  placeholder="e.g., 6 months"
                  placeholderTextColor="#494949"
                />
              </View>
  
              {/* Status */}
              <View className='pt-6'>
                <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Status</Text>
                <View style={styles.select}>
                  <Picker
                    selectedValue={inputs.status}
                    onValueChange={(value) => handleChange('status', value)}
                    style={{ borderRadius: 5 }}
                  >
                    <Picker.Item label="Select status" value="" />
                    <Picker.Item label="In Progress" value="in progress" />
                    <Picker.Item label="Completed" value="completed" />
                    <Picker.Item label="On Hold" value="on hold" />
                  </Picker>
                </View>
              </View>
            </View>
            
            {/* Arrays */}
            <View className='py-3'>
              {(['goals', 'plan', 'scope', 'budget', 'resources', 'challenges'] as const).map((key) => (
                <ArrayInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={arrayValues[key]}
                  setValue={(value) => updateArrayValue(key, value)}
                  array={arrays[key]}
                  setArray={(newArray) => updateArray(key, newArray)}
                  theme={theme}
                />
              ))}
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || uploading}
              style={{
                backgroundColor: theme.green_text,
                padding: 16,
                borderRadius: 8,
                marginTop: 24,
                opacity: submitting || uploading ? 0.6 : 1,
              }}
            >
              {submitting || uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">CREATE PROJECT</Text>
              )}
            </TouchableOpacity>
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