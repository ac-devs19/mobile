import { Redirect, Stack } from "expo-router"
import { useAuthContext } from "../../contexts/AuthContext"
import { LoadingScreen } from "../../components/Dialog"

const AuthLayout = () => {
  const { user, loading } = useAuthContext()

  if (user) {
    return <Redirect href="/home" />
  }

  return (
    <>
      <LoadingScreen visible={loading} />
      <Stack screenOptions={{
        headerTitle: '',
        headerShadowVisible: false
      }}>
        <Stack.Screen name='sign-in' options={{
          headerShown: false
        }} />
        <Stack.Screen name='forgot-password' />
        <Stack.Screen name='email-verification' />
        <Stack.Screen name='create-new-password' options={{
          headerBackVisible: false
        }} />
      </Stack>
    </>
  )
}

export default AuthLayout