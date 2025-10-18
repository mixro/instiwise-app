import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/src/context/ThemeContext';

interface Props {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
}

export default function SearchBar({ placeholder, value, onChangeText, onPress }: Props) {
    const { theme, toggleTheme } = useTheme();
    
  return (
    <View 
        className='border border-charcoal-color rounded-full flex-row items-center p-1 px-4 mb-7' 
        style={[{ borderColor: theme.icons }, styles.container]}
    >
      <Ionicons name="search" size={28} color={theme.text}/>
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-lg"
        style={{ color: theme.text }}
        placeholderTextColor={theme.text}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1.5
    }
})