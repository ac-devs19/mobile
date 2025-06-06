import { Alert, BackHandler, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Button, TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import Logo from '../../assets/images/logo.png'
import { useCallback, useState } from "react"
import { useAuthContext } from "../../contexts/AuthContext"
import { router, useFocusEffect } from "expo-router"

const SignIn = () => {
  const [toggle, setToggle] = useState(false)
  const [email_address, setEmailAddress] = useState("")
  const [student_number, setStudentNumber] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuthContext()
  const [showPass, setShowPass] = useState(false)

  const handleLogin = () => {
    if (!toggle) {
      if (email_address === "" || password === "") {
        return Alert.alert("Error!", "All fields are required.")
      }
      login({ student_email_address: email_address, password })
    } else {
      if (student_number === "" || password === "") {
        return Alert.alert("Error!", "All fields are required.")
      }
      login({ student_number, password })
    }
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 16, justifyContent: "space-between" }}>
        <View className="space-y-6">
          <View className="space-y-2">
            <Image resizeMode='contain' source={Logo} className="h-10 w-20" />
            <Text className="text-2xl font-pblack">Hello, Welcome!</Text>
            <Text className="text-sm font-pregular">Please login your account.</Text>
          </View>
          <View className="space-y-3">
            {!toggle ? (
              <TextInput onChangeText={(text) => setEmailAddress(text)} label={<Text className="font-pregular text-sm">Email Address</Text>} mode='outlined' keyboardType='email-address' outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
            ) : (
              <TextInput onChangeText={(text) => setStudentNumber(text)} label={<Text className="font-pregular text-sm">ID Number</Text>} mode='outlined' keyboardType='numeric' outlineStyle={{ borderRadius: 12 }} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
            )}
            <TextInput onChangeText={(text) => setPassword(text)} label={<Text className="font-pregular text-sm">Password</Text>} mode='outlined' secureTextEntry={!showPass} outlineStyle={{ borderRadius: 12 }} right={<TextInput.Icon onPress={() => setShowPass(!showPass)} icon={showPass ? 'eye' : 'eye-off'} />} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
            <View className="flex-row justify-end">
              <TouchableOpacity onPress={() => router.navigate('/forgot-password')} activeOpacity={0.7}>
                <Text className="font-pmedium text-sm text-blue-500">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="space-y-4">
          <Button onPress={handleLogin} uppercase mode='contained' contentStyle={{ height: 50 }} className='rounded-xl'>
            <Text className="text-sm font-pbold">Login</Text>
          </Button>
          <View className="flex-row items-center">
            <View className="flex-1 h-[1px] bg-gray-500" />
            <Text className="mx-3 text-center text-sm font-pregular">or</Text>
            <View className="flex-1 h-[1px] bg-gray-500" />
          </View>
          <Button onPress={() => setToggle(!toggle)} uppercase mode='outlined' contentStyle={{ height: 50 }} className='rounded-xl'>
            <Text className="text-sm font-pbold">
              {!toggle ? 'Login via ID Number' : 'Login via Email Address'}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn