import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { View, Text, ScrollView } from 'react-native'
import { List } from 'react-native-paper'

const Setting = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80" }}>
      <List.Section>
        <List.Subheader>
          <Text className="font-pmedium text-black">Account Settings</Text>
        </List.Subheader>
        <View className="px-4">
          <List.Item
            onPress={() => router.navigate('/profile/setting/change-password')}
            title={() => <Text className="font-pregular text-sm">Change Password</Text>}
            left={props => <Ionicons {...props} color='orange' name='key-outline' size={24} />}
            right={props => <Ionicons {...props} name='chevron-forward-outline' size={20} />}
            borderless
            className="bg-white rounded-xl"
          />
        </View>
      </List.Section>
    </ScrollView>
  )
}

export default Setting