import { SplashScreen, Stack } from 'expo-router'
import { PaperProvider, MD3LightTheme } from 'react-native-paper'
import { Colors } from '../constants/Colors'
import { AuthContext } from '../contexts/AuthContext'
import { useFonts } from "expo-font"
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [loaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "BrittanySignature": require("../assets/fonts/BrittanySignature.ttf"),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  const paperTheme = { ...MD3LightTheme, colors: Colors.light }

  return (
    <AuthContext>
      <PaperProvider theme={paperTheme}>
        <Stack screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen name='index' />
          <Stack.Screen name='(auth)' />
          <Stack.Screen name='(default)' />
        </Stack>
      </PaperProvider>
    </AuthContext>
  )
}

export default RootLayout