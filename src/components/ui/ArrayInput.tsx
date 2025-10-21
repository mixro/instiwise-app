// src/components/ui/ArrayInput.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

const ArrayInput = ({ label, value, setValue, array, setArray, theme }: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  array: string[];
  setArray: React.Dispatch<React.SetStateAction<string[]>>; // Updated to match React's setState
  theme: any;
}) => {
  const handleAddItem = () => {
    if (value.trim() !== '') {
      setArray((prev) => [...prev, value]); // Use prev state to ensure immutability
      setValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setArray((prev) => prev.filter((_, i) => i !== index)); // Use prev state for removal
  };

  return (
    <View className='pt-6'>
      <Text className='text-lg mb-3 font-medium' style={{ color: theme.text }}>{label}</Text>
      <View className='flex-row gap-2'>
        <TextInput
          className='py-3 font-medium border border-gray-300 dark:border-gray-600 rounded-md flex-1'
          value={value}
          onChangeText={setValue}
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={theme.gray_text}
          onSubmitEditing={handleAddItem}
          blurOnSubmit={false}
          returnKeyType="next"
        />
        <TouchableOpacity
          onPress={handleAddItem}
          style={{backgroundColor: theme.blue_text, paddingHorizontal: 8}}
          className='rounded-md flex-row items-center justify-center'
        >
          <FontAwesome6 name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {array.length > 0 && (
        <View className='mt-4'>
          <Text className='text-md mb-2 font-medium' style={{ color: theme.blue_text }}>Added {label}{label != 'Goals' && 's'}:</Text>
          <View className='flex-row flex-wrap gap-2'>
            {array.map((item, index) => (
              <View key={index} className='flex-row items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-md'>
                <Text className='text-sm text-gray-800 dark:text-gray-200 mr-2'>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                  <Ionicons name="close" size={16} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000',
  },
});

export default ArrayInput;