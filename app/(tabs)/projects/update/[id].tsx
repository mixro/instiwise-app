import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, StyleSheet,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import ArrayInput from '@/src/components/ui/ArrayInput';
import { ImageAsset, useImageUpload } from '@/src/hooks/useImageUpload';
import { useGetProjectByIdQuery, useUpdateProjectMutation,} from '@/src/services/projectsApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function UpdateProject() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: project, isLoading: loadingProject } = useGetProjectByIdQuery(id, {
    skip: !id,
  });

  const [updateProject, { isLoading: submitting }] = useUpdateProjectMutation();
  const { pickImage, uploadImage, uploading, progress } = useImageUpload();

  const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

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

  // Pre-fill form when project loads
  useEffect(() => {
    if (project) {
      setInputs({
        title: project.title,
        desc: project.description,
        category: project.category,
        problem: project.problem || "",
        duration: project.duration || "",
        status: project.status || "",
      });

      setExistingImageUrl(project.img);

      setArrays({
        goals: project.goals || [],
        scope: project.scope || [],
        budget: (project.budget || []).map(String),
        resources: project.resources || [],
        challenges: project.challenges || [],
        plan: project.plan || [],
      });
    }
  }, [project]);

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
    if (!inputs.title || !inputs.desc) {
      Alert.alert('Error', 'Title and description are required');
      return;
    }

    let imgUrl = existingImageUrl;

    // Upload new image if selected
    if (selectedImage) {
      const uploadResult = await uploadImage(selectedImage);
      if (!uploadResult) {
        Alert.alert('Upload Failed', 'Could not upload image');
        return;
      }
      imgUrl = uploadResult.url;
    }

    try {
      Haptics.selectionAsync();
      await updateProject({
        id,
        updates: {
          title: inputs.title,
          description: inputs.desc,
          img: imgUrl,
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
        },
      }).unwrap();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Project updated!', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', error.data?.message || 'Failed to update project');
    }
  };

  if (loadingProject) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.blue_text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, flex: 1 }} className='px-4'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Navbar title='UPDATE PROJECT' />

          <View className='pb-7'>
            {/* Title */}
            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Title</Text>
              <TextInput
                value={inputs.title}
                onChangeText={(text) => handleChange('title', text)}
                style={styles.input}
                placeholder="Project title"
                placeholderTextColor="#494949"
              />
            </View>

            {/* Image */}
            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Project Image</Text>

              {/* Current Image */}
              {existingImageUrl && !selectedImage && (
                <View className="mb-4">
                  <Text className="text-sm mb-2" style={{ color: theme.text }}>Current:</Text>
                  <Image source={{ uri: existingImageUrl }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
                </View>
              )}

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
                    <Text className='font-bold text-white'>CHANGE IMAGE</Text>
                    <Ionicons name="image" size={24} color="white" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>

              {selectedImage && (
                <View className="mt-4">
                  <Text className="text-sm mb-2" style={{ color: theme.text }}>New Preview:</Text>
                  <Image source={{ uri: selectedImage.uri }} style={{ width: '100%', height: 200, borderRadius: 8 }} />
                </View>
              )}

              {uploading && (
                <View className="mt-4">
                  <Text className="text-sm mb-2" style={{ color: theme.text }}>Uploading...</Text>
                  <View style={{ height: 6, backgroundColor: '#ddd', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${progress}%`, backgroundColor: theme.green_text }} />
                  </View>
                  <Text className="text-xs mt-1" style={{ color: theme.text }}>{progress}%</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Description</Text>
              <TextInput
                value={inputs.desc}
                onChangeText={(text) => handleChange('desc', text)}
                placeholder="Project description"
                placeholderTextColor="#494949"
                multiline
                numberOfLines={5}
                style={styles.textArea}
                textAlignVertical="top"
              />
            </View>

            {/* Other Fields */}
            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Category</Text>
              <TextInput value={inputs.category} onChangeText={(t) => handleChange('category', t)} style={styles.input} />
            </View>

            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Problem Solved</Text>
              <TextInput value={inputs.problem} onChangeText={(t) => handleChange('problem', t)} style={styles.input} />
            </View>

            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text}}>Duration</Text>
              <TextInput value={inputs.duration} onChangeText={(t) => handleChange('duration', t)} style={styles.input} />
            </View>

            <View className='pt-6'>
              <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>Status</Text>
              <View style={styles.select}>
                <Picker selectedValue={inputs.status} onValueChange={(v) => handleChange('status', v)}>
                  <Picker.Item label="In Progress" value="in progress" />
                  <Picker.Item label="Completed" value="completed" />
                  <Picker.Item label="On Hold" value="on hold" />
                </Picker>
              </View>
            </View>

            {/* Arrays */}
            <View className='py-3'>
              {(['goals', 'plan', 'scope', 'budget', 'resources', 'challenges'] as const).map((key) => (
                <ArrayInput
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={arrayValues[key]}
                  setValue={(v) => updateArrayValue(key, v)}
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
                <Text className="text-white text-center font-bold text-lg">UPDATE PROJECT</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  input: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    paddingLeft: 10,
    paddingVertical: 12,
  },
  select: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  textArea: {
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    padding: 10,
    minHeight: 120,
  },
});