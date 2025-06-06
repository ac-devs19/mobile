import { router, Tabs, useFocusEffect } from "expo-router"
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from "react-native-safe-area-context"
import { Image, Text, View } from "react-native"
import Logo from '../../../assets/images/logo.png'
import { Badge, IconButton } from "react-native-paper"
import { useState } from "react"
import { useEffect } from "react"
import axios from "../../../api/axios"
import { useCallback } from "react"

const TabIcon = ({ title, icon, color, focused }) => (
  <View className="items-center">
    <Ionicons name={icon} size={24} color={color} />
    <Text className={`font-pmedium ${focused ? 'text-blue-500' : 'text-gray-500'}`}>{title}</Text>
  </View>
)

const TabLayout = () => {
  const [notif, setNotif] = useState()

  useFocusEffect(
    useCallback(() => {
      const loadNotif = async () => {
        await axios.get('/student/notif-count')
          .then(({ data }) => {
            setNotif(data)
          })
      }
      loadNotif()
    }, [])
  )

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: "#3b82f6",
      headerShadowVisible: false,
      tabBarShowLabel: false,
      headerTitleAlign: "center",
      headerTitleStyle: {
        textTransform: "capitalize"
      },
      tabBarStyle: {
        height: 70,
        position: "absolute",
        shadowColor: "transparent",
        borderColor: "transparent",
      }
    }}>
      <Tabs.Screen
        name='home'
        options={{
          header: () => (
            <SafeAreaView className="bg-blue-100/50">
              <View className="px-4 pt-4 flex-row justify-between items-center">
                <Image resizeMode='contain' source={Logo} className="h-10 w-20" />
                <View>
                  <Badge visible={notif > 0 ? true : false} className="absolute z-10 bg-red-500">
                    <Text className="font-pregular">{notif}</Text>
                  </Badge>
                  <IconButton
                    onPress={() => router.navigate('home/notification')}
                    icon="bell"
                    iconColor="orange"
                    size={24}
                    containerColor="white"
                  />
                </View>
              </View>
            </SafeAreaView>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? 'home' : 'home-outline'} title="Home" color={color} focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={focused ? 'person' : 'person-outline'} title="Profile" color={color} focused={focused} />
          ),
          headerTitle: () => (
            <Text className="text-lg font-psemibold">Profile</Text>
          )
        }}
      />
    </Tabs>
  )
}

export default TabLayout