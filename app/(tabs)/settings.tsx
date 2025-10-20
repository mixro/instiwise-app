import { View, Text, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/src/components/navigation/navbar';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Settings() {
    const { theme } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View>
            <Navbar title="Settings" />

            <View style={{paddingVertical: 20}}>
              <View>
                <Text className='text-lg font-semibold mb-5' style={{color: theme.blue_text}}>Your account</Text>
                <Link href="/" asChild>
                  <TouchableOpacity>
                    <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                      <Ionicons name="person" size={24} color={theme.gray_text} />
                      <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Personal details</Text>
                      <AntDesign name="right" size={18} color={theme.text} />
                    </View>
                  </TouchableOpacity>
                </Link>
                <Link href="/" asChild>
                  <TouchableOpacity>
                    <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                      <MaterialIcons name="security" size={24} color={theme.gray_text} />
                      <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Password</Text>
                      <AntDesign name="right" size={18} color={theme.text} />
                    </View>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity>
                  <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                    <MaterialIcons name="delete" size={26} color={theme.gray_text} />
                    <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Delete account</Text>
                    <AntDesign name="right" size={18} color={theme.text} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{paddingVertical: 20}}>
              <View>
                <Text className='text-lg font-semibold mb-5' style={{color: theme.blue_text}}>Authentification</Text>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                      <Ionicons name="person-add" size={24} color={theme.gray_text} />
                      <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Sign up</Text>
                      <AntDesign name="right" size={18} color={theme.text} />
                    </View>
                  </TouchableOpacity>
                </Link>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                      <MaterialIcons name="login" size={26} color={theme.gray_text} />
                      <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Login</Text>
                      <AntDesign name="right" size={18} color={theme.text} />
                    </View>
                  </TouchableOpacity>
                </Link>
                <TouchableOpacity>
                  <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                    <AntDesign name="logout" size={23} color={theme.gray_text} />
                    <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Logout</Text>
                    <AntDesign name="right" size={18} color={theme.text} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{paddingVertical: 20}}>
              <View>
                <Text className='text-lg font-semibold mb-5' style={{color: theme.blue_text}}>More info and support</Text>
                <TouchableOpacity>
                  <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                    <Ionicons name="help-buoy-sharp" size={24} color={theme.gray_text} />
                    <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Help</Text>
                    <AntDesign name="right" size={18} color={theme.text} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                    <MaterialIcons name="privacy-tip" size={24} color={theme.gray_text} />
                    <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>Privacy center</Text>
                    <AntDesign name="right" size={18} color={theme.text} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View className='flex-row items-center gap-3' style={{paddingVertical: 8}}>
                    <Ionicons name="information-circle" size={26} color={theme.gray_text} />
                    <Text className="flex-1" style={{color: theme.text, fontSize: 15}}>About</Text>
                    <AntDesign name="right" size={18} color={theme.text} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}