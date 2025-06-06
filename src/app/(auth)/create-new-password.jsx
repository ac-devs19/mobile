import { useCallback, useState } from 'react'
import { View, Text, ScrollView, Alert, BackHandler } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useAuthContext } from '../../contexts/AuthContext'
import { useFocusEffect } from 'expo-router'

const CreateNewPassword = () => {
  const [password, setPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")
  const { email_address, createNewPassword } = useAuthContext()

  const handleCreateNewPassword = () => {
    if (password === "" || password_confirmation === "") {
      return Alert.alert("Error!", "All fields are required.")
    }
    createNewPassword({ student_email_address: email_address, password, password_confirmation })
  }

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {
            text: 'Cancel',
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
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1, padding: 16, justifyContent: "space-between", gap: 24 }}>
      <View className="space-y-6">
        <View className="flex-row items-center justify-between space-x-2">
          <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
          <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
          <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
        </View>
        <View className="space-y-2">
          <Text className="text-xl font-pbold">Create New Password</Text>
          <Text className="text-sm font-pregular">Please make a new password.</Text>
        </View>
        <View className="space-y-3">
          <TextInput onChangeText={(text) => setPassword(text)} label={<Text className="font-pregular text-sm">Password</Text>} mode='outlined' secureTextEntry outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
          <TextInput onChangeText={(text) => setPasswordConfirmation(text)} label={<Text className="font-pregular text-sm">Confirm Password</Text>} mode='outlined' secureTextEntry outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
        </View>
      </View>
      <Button onPress={handleCreateNewPassword} uppercase mode='contained' contentStyle={{ height: 50 }} className='rounded-xl'>
        <Text className="text-sm font-pbold">Change</Text>
      </Button>
    </ScrollView>
  )
}

export default CreateNewPassword