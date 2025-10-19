import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { homeStatsData } from '@/src/static/dummyData';

export default function HomeStats() {
    const { theme, toggleTheme } = useTheme();
        
  return (
    <View className='flex-row justify-between flex-wrap' style={styles.statsContainer}>
        {homeStatsData.map((stat, index) => (
            <View
                key={index}
                className="bg-white p-2 rounded-lg shadow"
                style={[
                    { backgroundColor: theme.cards_background }, 
                    styles.statsItem
                ]}
            >
                <View className='flex-row justify-between items-center'>
                    <Text style={[{ color: theme.text }, styles.title]}>
                        {stat.title}
                    </Text>
                    <Ionicons name={stat.icon} size={20} color={theme.icons} />
                </View>
                <Text style={[{ color: theme.text }, styles.value]}>
                    {stat.value}
                </Text>
                <Text className="mt-3" style={[{ color: theme.text }, styles.title]}>
                    {stat.desc}
                </Text>
            </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
    statsContainer: {
        flexWrap: "wrap",
        paddingTop: 25, 
    },
    statsItem: {
        width: "48%",
        marginBottom: "4%"
    },
    title: {
        fontSize: 14,
    },
    value: {
        fontSize: 27,
        fontWeight: 600,
        marginVertical: 12
    }
})