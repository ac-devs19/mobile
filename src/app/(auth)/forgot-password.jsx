import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useAuthContext } from '../../contexts/AuthContext'
import { Timer } from '../../components/Dialog'

const ForgotPassword = () => {
  const [email_address, setEmailAddress] = useState("")
  const { forgotPassword, timer } = useAuthContext()
  const [visible, setVisible] = useState(false)

  const handleForgotPassword = () => {
    if (email_address === "") {
      return Alert.alert("Error!", "Email address is required.")
    }
    if (timer) {
      return setVisible(true)
    }
    forgotPassword({ student_email_address: email_address })
  }

  useEffect(() => {
    if (timer === 0) {
      setVisible(false)
    }
  }, [timer])

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1, padding: 16, justifyContent: "space-between", gap: 24 }}>
        <View className="space-y-6">
          <View className="flex-row items-center justify-between space-x-2">
            <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
            <View className="flex-1 bg-gray-300 h-[6px] rounded-full"></View>
            <View className="flex-1 bg-gray-300 h-[6px] rounded-full"></View>
          </View>
          <View className="space-y-2">
            <Text className="text-xl font-pbold">Forgot Password</Text>
            <Text className="text-sm font-pregular">Please enter your email address, and we'll send you a one-time password (OTP) for verification.</Text>
          </View>
          <TextInput onChangeText={(text) => setEmailAddress(text)} label={<Text className="font-pregular text-sm">Email Address</Text>} mode='outlined' keyboardType='email-address' outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
        </View>
        <Button onPress={handleForgotPassword} uppercase mode='contained' contentStyle={{ height: 50 }} className='rounded-xl'>
          <Text className="text-sm font-pbold">Send</Text>
        </Button>
      </ScrollView>
      <Timer visible={visible} onDismiss={() => setVisible(!visible)} />
    </>
  )
}

export default ForgotPassword