import { Image, ScrollView, Text, View } from 'react-native'
import UserMale from '../../../../assets/images/user-male.png'
import UserFemale from '../../../../assets/images/user-female.png'
import { List } from 'react-native-paper'
import { useAuthContext } from '../../../../contexts/AuthContext'

const Information = () => {
  const { user } = useAuthContext()

  return (
    <View className="flex-1 bg-white">
      <View className="h-48 items-center justify-center">
        <Image source={user.student.information.gender.toLowerCase() === 'male' && UserMale || user.student.information.gender.toLowerCase() === 'female' && UserFemale} resizeMode='contain' className="w-24 h-24" />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <List.Section>
          <List.Subheader>
            <Text className="font-pmedium text-black">Personal Details</Text>
          </List.Subheader>
          <List.Item
            title={() => <Text className="text-sm font-pregular">Full Name</Text>}
            right={props => <Text {...props} className="text-sm font-pregular">{`${user.student.information.last_name}, ${user.student.information.first_name} ${user.student.information.middle_name}`}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Gender</Text>}
            right={props => <Text {...props} className="capitalize text-sm font-pregular">{user.student.information.gender}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Email Address</Text>}
            right={props => <Text {...props} className="text-sm font-pregular">{user.student.information.email_address}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Contact Number</Text>}
            right={props => <Text {...props} className="text-sm font-pregular">{user.student.information.contact_number}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Student ID Number</Text>}
            right={props => <Text {...props} className="text-sm font-pregular">{user.student.student_number}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Course</Text>}
            right={props => <Text {...props} className="uppercase text-sm font-pregular">{user.student.course}</Text>}
          />
          <List.Item
            title={() => <Text className="text-sm font-pregular">Student Type</Text>}
            right={props => <Text {...props} className="capitalize text-sm font-pregular">{user.student.student_type}</Text>}
          />
        </List.Section>
      </ScrollView>
    </View>
  )
}

export default Information