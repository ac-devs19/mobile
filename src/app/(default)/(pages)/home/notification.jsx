import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'
import axios from '../../../../api/axios'
import { setName } from '../../../../components/Name'
import Notif from '../../../../assets/images/notification.png'
import { LoadingScreen } from '../../../../components/Dialog'

const { width } = Dimensions.get('window')

const Notification = () => {
  const [index, setIndex] = useState(0)
  const [documentNotif, setDocumentNotif] = useState([])
  const [credentialNotif, setCredentialNotif] = useState([])
  const [loading, setLoading] = useState(false)
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })
  const [routes] = useState([
    { key: 'slide1', title: 'Documents' },
    { key: 'slide2', title: 'Credentials' },
  ])

  useFocusEffect(
    useCallback(() => {
      const getNotif = async () => {
        setLoading(true)
        await getDocumentNotif()
        await getCredentialNotif()
        setLoading(false)
      }
      getNotif()
    }, [])
  )

  const getDocumentNotif = async () => {
    await axios.get('/student/get-document-notif')
      .then(({ data }) => {
        setDocumentNotif(data)
      })
  }

  const readDocumentNotif = async (id) => {
    await axios.post('/student/read-document-notif', { id })
      .then(() => {
        getDocumentNotif()
      })
  }

  const getCredentialNotif = async () => {
    await axios.get('/student/get-credential-notif')
      .then(({ data }) => {
        setCredentialNotif(data)
      })
  }

  const readCredentialNotif = async (id) => {
    await axios.post('/student/read-credential-notif', { id })
      .then(() => {
        getCredentialNotif()
      })
  }

  const Slide1 = () => (
    <>
      {documentNotif.length === 0 ? (
        <View className="flex-1 bg-white items-center justify-center space-y-1">
          <Image source={Notif} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Notifications Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "white", padding: 8, gap: 8 }}>
          {documentNotif.map((notif, index) => (
            <TouchableOpacity onPress={() => {
              router.navigate(`home/my-document/${notif.submit.record[0].document.id}`)
              setName(notif.submit.record[0].document.document_name)
              if (notif.notification_status === 'unread') {
                readDocumentNotif(notif.id)
              }
            }} activeOpacity={0.7} key={index} className={`p-3 rounded-xl space-y-3 cursor-pointer ${notif.notification_status === 'unread' && 'bg-blue-100/50 border border-blue-200' || notif.notification_status === 'read' && 'bg-gray-50 border border-gray-200'}`}>
              <Text className='text-sm font-pregular'>Your submission of <Text className="text-blue-500 font-pmedium">{notif.submit.record[0].document.document_name}</Text> has been <Text className={`font-pmedium ${notif.submit_status === 'confirm' && 'text-green-500' || notif.submit_status === 'decline' && 'text-red-500'}`}>{notif.submit_status === 'confirm' && 'Confirmed' || notif.submit_status === 'decline' && 'Declined'}</Text> by the admin.</Text>
              <View className="flex-row justify-end">
                <Text className='text-xs font-pregular'>{formatDateTime(notif.created_at)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  )

  const Slide2 = () => (
    <>
      {credentialNotif.length === 0 ? (
        <View className="flex-1 bg-white items-center justify-center space-y-1">
          <Image source={Notif} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Notifications Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "white", padding: 8, gap: 8 }}>
          {credentialNotif.map((notif, index) => (
            <TouchableOpacity onPress={() => {
              router.navigate(`home/my-credential/status/${notif.request.request_number}`)
              if (notif.notification_status === 'unread') {
                readCredentialNotif(notif.id)
              }
            }} activeOpacity={0.7} key={index} className={`p-3 rounded-xl space-y-3 cursor-pointer ${notif.notification_status === 'unread' && 'bg-blue-100/50 border border-blue-200' || notif.notification_status === 'read' && 'bg-gray-50 border border-gray-200'}`}>
              <Text className='text-sm font-pregular'>Your request for a <Text className="text-blue-500 font-pmedium">{notif.request.request_credential.credential.credential_name}</Text> {notif.request_status === 'receive' ? 'is now ready for a' : 'has been'}{notif.request_status !== 'receive' ? ' ' : ''}{notif.request_status === 'paid' && 'marked as'} <Text className={`font-pmedium ${notif.request_status === 'confirm' && 'text-green-500' || notif.request_status === 'decline' && 'text-red-500' || notif.request_status === 'paid' && 'text-green-500' || notif.request_status === 'process' && 'text-cyan-500' || notif.request_status === 'receive' && 'text-indigo-500' || notif.request_status === 'complete' && 'text-green-500' || notif.request_status === 'cancel' && 'text-red-500'}`}>{notif.request_status === 'confirm' && 'Confirmed' || notif.request_status === 'decline' && 'Declined' || notif.request_status === 'paid' && 'Paid' || notif.request_status === 'process' && 'Processed' || notif.request_status === 'receive' && 'Claim' || notif.request_status === 'complete' && 'Completed' || notif.request_status === 'cancel' && 'Cancelled'}</Text>{notif.request_status !== 'receive' ? ' ' : ''}{notif.request_status !== 'receive' && `by the ${notif.request_status === 'paid' ? 'cashier' : 'admin'}`}.</Text>
              <View className="flex-row justify-end">
                <Text className='text-xs font-pregular'>{formatDateTime(notif.created_at)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  )

  const renderScene = SceneMap({
    slide1: Slide1,
    slide2: Slide2,
  })

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#3b82f6' }}
      style={{ backgroundColor: 'white', shadowColor: "transparent" }}
      labelStyle={{ color: 'black', fontWeight: 500, textTransform: "capitalize", fontFamily: "Poppins-Medium" }}
    />
  )

  return (
    <>
      <LoadingScreen visible={loading} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={renderTabBar}
      />
    </>
  )
}

export default Notification