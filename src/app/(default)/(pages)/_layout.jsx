import { router, Stack } from 'expo-router'
import { getName, setName } from '../../../components/Name'
import { Text, TouchableOpacity } from 'react-native'

const PageLayout = () => {
  return (
    <Stack screenOptions={{
      headerShadowVisible: false,
      headerTitleAlign: 'center'
    }}>
      <Stack.Screen name='home/my-document' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">My Documents</Text>
        )
      }} />
      <Stack.Screen name='home/my-document/[id]' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">{getName()}</Text>
        )
      }} />
      <Stack.Screen name='home/my-credential' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">My Credentials</Text>
        ),
        headerRight: () => (
          <TouchableOpacity activeOpacity={0.7} onPress={() => {
            router.navigate(`/home/my-credential/history`)
            setName('History')
          }} className="py-2">
            <Text className="text-sm font-pmedium text-blue-500">History</Text>
          </TouchableOpacity>
        )
      }} />
      <Stack.Screen name='home/my-credential/request' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Request Credentials</Text>
        )
      }} />
      <Stack.Screen name='home/my-credential/[status]' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">{getName()}</Text>
        )
      }} />
      <Stack.Screen name='home/my-credential/status/[id]' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Request Details</Text>
        )
      }} />
      <Stack.Screen name='home/notification' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Notifications</Text>
        )
      }} />
      <Stack.Screen name='profile/setting' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Settings</Text>
        )
      }} />
      <Stack.Screen name='profile/information' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Me</Text>
        )
      }} />
      <Stack.Screen name='profile/setting/change-password' options={{
        headerTitle: () => (
          <Text className="text-lg font-psemibold">Change Password</Text>
        )
      }} />
    </Stack>
  )
}

export default PageLayout