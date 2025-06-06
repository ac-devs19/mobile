import { Ionicons } from '@expo/vector-icons'
import { View, Text, Image } from 'react-native'
import { ActivityIndicator, Button, Dialog, Modal, Portal } from 'react-native-paper'
import { useAuthContext } from '../contexts/AuthContext'
import OCC_Logo from '../assets/images/OCC_LOGO.png'

const SecurityAlert = ({ visible, onPress }) => {
  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} className="bg-white rounded-xl">
        <Dialog.Title className="text-center font-pmedium">Security Alert!</Dialog.Title>
        <Dialog.Content>
          <View className="items-center space-y-3">
            <Ionicons name='lock-closed' size={50} color='red' />
            <Text className="text-sm font-pregular">Please change your password.</Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onPress} mode='contained' className="w-full">
            <Text className="text-sm font-pmedium">Change Password</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const LoadingScreen = ({ visible }) => {
  return (
    <Portal>
      <Modal visible={visible} dismissable={false}>
        <View className="relative mx-auto flex items-center justify-center">
          <ActivityIndicator animating={visible} color="#fde047" size={93} className="absolute" />
          <Image source={OCC_Logo} resizeMode='contain' className="absolute w-[85px] h-[85px]" />
        </View>
      </Modal>
    </Portal>
  )
}

const Timer = ({ visible, onDismiss }) => {
  const { timer } = useAuthContext()
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} className="bg-white rounded-xl">
        <Dialog.Title>
          <Text className="font-pmedium">Please wait</Text>
        </Dialog.Title>
        <Dialog.Content>
          <Text className="text-sm font-pregular">Resend code in {minutes}:{seconds < 10 ? `0${seconds}` : seconds} {seconds <= 1 ? 'second...' : 'seconds...'}</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

export { SecurityAlert, LoadingScreen, Timer }