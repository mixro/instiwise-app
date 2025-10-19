import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProjectsItem } from '@/src/interfaces/interfaces'
import { useTheme } from '@/src/context/ThemeContext';

export default function ProjectDetails({project} : {project: ProjectsItem}) {
    const { theme } = useTheme();
    const [height, setHeight] = useState(0);
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        Image.getSize(project.img, (width, height) => {
            const scaleFactor = width / screenWidth;
            const imageHeight = height / scaleFactor;
            setHeight(imageHeight);
        });
    }, []);

  return (
    <View>
      <View>
        <View style={{paddingVertical: 30}}>
            <Image source={{ uri: project.img }}
                className="w-full"
                resizeMode="cover"
                style={[{ width: "100%", height, borderRadius: 8}]}
            />
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>PROJECTS GOALS</Text>
            {project.goals.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>{item}</Text>
                </View>
            ))}
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>PROJECTS SCOPE</Text>
            {project.scope?.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>{item}</Text>
                </View>
            ))}
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>PROJECTS PLAN</Text>
            {project.plan?.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>{item}</Text>
                </View>
            ))}
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>RESOURCES</Text>
            {project.resources?.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>{item}</Text>
                </View>
            ))}
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>PROJECT BUDGET</Text>
            {project.budget?.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>$ {item}</Text>
                </View>
            ))}
        </View>
        <View style={{paddingBottom: 30}}>
            <Text className='font-bold text-xl' style={{color: theme.blue_text, marginBottom: 10}}>PROJECT CHALLENGES</Text>
            {project.challenges?.map((item, index) => (
                <View key={index} className='flex-row items-center' style={{gap: 8, marginLeft: 10}}>
                    <View style={[{backgroundColor: theme.text}, styles.dot]}></View>
                    <Text className='text-lg' style={{color: theme.text}}>{item}</Text>
                </View>
            ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
  }
});