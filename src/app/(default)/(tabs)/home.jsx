import { Alert, BackHandler, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import User from '../../../components/User'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { useAuthContext } from '../../../contexts/AuthContext'
import { SecurityAlert } from '../../../components/Dialog'
import axios from '../../../api/axios'

const Home = () => {
  const { user } = useAuthContext()
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(null)

  const goChangePassword = () => {
    router.navigate('profile/setting/change-password')
    setVisible(false)
  }

  useFocusEffect(
    useCallback(() => {
      if (user.is_password_changed !== 'yes') {
        setVisible(true)
      }
    }, [user])
  )

  useFocusEffect(
    useCallback(() => {
      const getRecordStatus = async () => {
        await axios.get('/student/get-record-status')
          .then(({ data }) => {
            setStatus(data)
          })
      }
      getRecordStatus()
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'No',
            style: 'cancel',
          },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true
      }

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      )

      return () => backHandler.remove()
    }, [])
  )

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 16 }}>
        <User />
        <View className="space-y-4 mt-6">
          <TouchableOpacity onPress={() => router.navigate('/home/my-document')} activeOpacity={0.7} className="bg-indigo-500/80 p-6 rounded-xl flex-row items-center justify-between">
            <View className="space-y-2">
              <Text className="text-white font-pbold text-xl">My Documents</Text>
              <Text className="text-xs text-white font-pregular">Submit documents</Text>
            </View>
            <Ionicons name='folder' color='white' size={70} />
          </TouchableOpacity>
          {status && status === 'complete' && (
            <TouchableOpacity onPress={() => router.navigate('/home/my-credential')} activeOpacity={0.7} className="bg-yellow-500/80 p-6 rounded-xl flex-row items-center justify-between">
              <View className="space-y-2">
                <Text className="text-white font-pbold text-xl">My Credentials</Text>
                <Text className="text-xs text-white font-pregular">Request credentials</Text>
              </View>
              <Ionicons name='document-text' color='white' size={70} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <SecurityAlert visible={visible} onPress={goChangePassword} />
    </View>
  )
}

export default Home