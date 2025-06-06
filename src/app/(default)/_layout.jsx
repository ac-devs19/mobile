import { Redirect, Stack } from "expo-router"
import { useAuthContext } from "../../contexts/AuthContext"
import { LoadingScreen } from "../../components/Dialog"

const DefaultLayout = () => {
  const { user, loading } = useAuthContext()

  if (!user) {
    return <Redirect href="/sign-in" />
  }

  return (
    <>
      <LoadingScreen visible={loading} />
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='(pages)' />
      </Stack>
    </>
  )
}

export default DefaultLayout