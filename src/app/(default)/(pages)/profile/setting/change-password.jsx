import { View, Text, ScrollView, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useAuthContext } from '../../../../../contexts/AuthContext'
import { useState } from 'react'

const ChangePassword = () => {
  const { user, changePassword } = useAuthContext()
  const [current_password, setCurrentPassword] = useState("")
  const [new_password, setNewPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")

  const handleChangePassword = () => {
    if (user.is_password_changed !== 'yes') {
      if (new_password === "" || password_confirmation === "") {
        return Alert.alert("Error!", "All fields are required.")
      }
      changePassword({ password: new_password, password_confirmation })
    } else {
      if (current_password === "" || new_password === "" || password_confirmation === "") {
        return Alert.alert("Error!", "All fields are required.")
      }
      changePassword({ current_password, password: new_password, password_confirmation })
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1, padding: 16, justifyContent: "space-between", gap: 24 }}>
      <View className="space-y-3">
        {user.is_password_changed === 'yes' && (
          <TextInput onChangeText={(text) => setCurrentPassword(text)} label={<Text className="font-pregular text-sm">Current Password</Text>} mode='outlined' outlineStyle={{ borderRadius: 12 }} secureTextEntry contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
        )}
        <TextInput onChangeText={(text) => setNewPassword(text)} label={<Text className="font-pregular text-sm">New Password</Text>} mode='outlined' outlineStyle={{ borderRadius: 12 }} secureTextEntry contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
        <TextInput onChangeText={(text) => setPasswordConfirmation(text)} label={<Text className="font-pregular text-sm">Confirm Password</Text>} mode='outlined' outlineStyle={{ borderRadius: 12 }} secureTextEntry contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
      </View>
      <Button onPress={handleChangePassword} uppercase mode='contained' contentStyle={{ height: 50 }} className='rounded-xl'>
        <Text className="text-sm font-pbold">Change</Text>
      </Button>
    </ScrollView>
  )
}

export default ChangePassword