import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useAuthContext } from '../../contexts/AuthContext'
import { useState } from 'react'

const EmailVerification = () => {
  const [otp, setOtp] = useState("")
  const { email_address, timer, verifyOtp, resendOtp } = useAuthContext()
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60

  const handleVerify = () => {
    if (otp === "") {
      return Alert.alert("Error!", "OTP is required.")
    }
    verifyOtp({ otp, email_address })
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1, padding: 16, justifyContent: "space-between", gap: 24 }}>
      <View className="space-y-6">
        <View className="flex-row items-center justify-between space-x-2">
          <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
          <View className="flex-1 bg-blue-500 h-[6px] rounded-full"></View>
          <View className="flex-1 bg-gray-300 h-[6px] rounded-full"></View>
        </View>
        <View className="space-y-2">
          <Text className="text-xl font-pbold">Email Verification</Text>
          <Text className="text-sm font-pregular">Please enter the one-time password (OTP) that we sent to <Text className="font-semibold">{email_address}</Text></Text>
        </View>
        <TextInput onChangeText={(text) => setOtp(text)} label={<Text className="font-pregular text-sm">OTP</Text>} mode='outlined' keyboardType='numeric' maxLength={6} outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
        <View className="items-center">
          {timer <= 0 ? (
            <TouchableOpacity onPress={() => resendOtp(email_address)} activeOpacity={0.7}>
              <Text className="font-pmedium text-blue-500 text-sm">Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text className="font-pregular text-sm">Resend code in {minutes}:{seconds < 10 ? `0${seconds}` : seconds} {seconds <= 1 ? 'second...' : 'seconds...'}</Text>
          )}
        </View>
      </View>
      <Button onPress={handleVerify} uppercase mode='contained' contentStyle={{ height: 50 }} className='rounded-xl'>
        <Text className="text-sm font-pbold">Verify</Text>
      </Button>
    </ScrollView>
  )
}

export default EmailVerification