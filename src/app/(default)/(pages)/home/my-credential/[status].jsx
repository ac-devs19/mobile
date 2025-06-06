import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { useState } from 'react'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import axios from '../../../../../api/axios'
import { LoadingScreen } from '../../../../../components/Dialog'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import CheckList from '../../../../../assets/images/checklist.png'

const { width } = Dimensions.get('window')

const MyCredentialStatus = () => {
  const [requests, setRequests] = useState([])
  const { status } = useLocalSearchParams()
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [routes] = useState(() =>
    status === 'pay' ?
      [
        { key: 'slide1', title: 'Payable' },
        { key: 'slide2', title: 'Paid' },
      ] :
      status === 'history' ?
        [
          { key: 'slide3', title: 'Completed' },
          { key: 'slide4', title: 'Cancelled' },
        ]
        : []
  )

  useFocusEffect(
    useCallback(() => {
      const getRequest = async () => {
        setLoading(true)
        await axios.get('/student/get-request-status', {
          params: { status }
        })
          .then(({ data }) => {
            setRequests(data)
          })
          .finally(() => {
            setLoading(false)
          })
      }
      getRequest()
    }, [])
  )

  const Slide1 = () => (
    <>
      {requests.filter((request) => !request.payment).length === 0 ? (
        <View className="flex-1 bg-blue-100/50 items-center justify-center space-y-1">
          <Image source={CheckList} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Requests Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8, gap: 8 }}>
          {requests
            .filter((request) => !request.payment)
            .map((request, index) => (
              <TouchableOpacity key={index} onPress={() => router.navigate(`home/my-credential/status/${request.request_number}`)} activeOpacity={0.7} className="bg-white p-4 rounded-xl space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-pregular">Request No.: {request.request_number}</Text>
                  <Text className="text-orange-500 font-pmedium text-sm capitalize">Payable</Text>
                </View>
                <Text className="text-sm font-pregular">{request.request_credential.credential.credential_name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </>
  )

  const Slide2 = () => (
    <>
      {requests.filter((request) => request.payment).length === 0 ? (
        <View className="flex-1 bg-blue-100/50 items-center justify-center space-y-1">
          <Image source={CheckList} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Requests Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8, gap: 8 }}>
          {requests
            .filter((request) => request.payment)
            .map((request, index) => (
              <TouchableOpacity key={index} onPress={() => router.navigate(`home/my-credential/status/${request.request_number}`)} activeOpacity={0.7} className="bg-white p-4 rounded-xl space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-pregular">Request No.: {request.request_number}</Text>
                  <Text className="text-green-500 font-pmedium text-sm capitalize">Paid</Text>
                </View>
                <Text className="text-sm font-pregular">{request.request_credential.credential.credential_name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </>
  )

  const Slide3 = () => (
    <>
      {requests.filter((request) => request.request_status === 'complete').length === 0 ? (
        <View className="flex-1 bg-blue-100/50 items-center justify-center space-y-1">
          <Image source={CheckList} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Requests Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8, gap: 8 }}>
          {requests
            .filter((request) => request.request_status === 'complete')
            .map((request, index) => (
              <TouchableOpacity key={index} onPress={() => router.navigate(`home/my-credential/status/${request.request_number}`)} activeOpacity={0.7} className="bg-white p-4 rounded-xl space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-pregular">Request No.: {request.request_number}</Text>
                  <Text className="text-sm font-pmedium capitalize text-green-500">Completed</Text>
                </View>
                <Text className="text-sm font-pregular">{request.request_credential.credential.credential_name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </>
  )

  const Slide4 = () => (
    <>
      {requests.filter((request) => request.request_status === 'cancel').length === 0 ? (
        <View className="flex-1 bg-blue-100/50 items-center justify-center space-y-1">
          <Image source={CheckList} resizeMode="contain" className="w-20 h-20" />
          <Text className="text-sm font-pregular">No Requests Yet</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8, gap: 8 }}>
          {requests
            .filter((request) => request.request_status === 'cancel')
            .map((request, index) => (
              <TouchableOpacity key={index} onPress={() => router.navigate(`home/my-credential/status/${request.request_number}`)} activeOpacity={0.7} className="bg-white p-4 rounded-xl space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-pregular">Request No.: {request.request_number}</Text>
                  <Text className="text-sm font-pmedium capitalize text-red-500">Cancelled</Text>
                </View>
                <Text className="text-sm font-pregular">{request.request_credential.credential.credential_name}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      )}
    </>
  )

  const payRenderScene = SceneMap({
    slide1: Slide1,
    slide2: Slide2,
  })

  const historyRenderScene = SceneMap({
    slide3: Slide3,
    slide4: Slide4,
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
      {status === 'pay' || status === 'history' ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={status === 'pay' && payRenderScene || status === 'history' && historyRenderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={renderTabBar}
        />
      ) : (
        <>
          {requests.length === 0 ? (
            <View className="flex-1 bg-blue-100/50 items-center justify-center space-y-1">
              <Image source={CheckList} resizeMode="contain" className="w-20 h-20" />
              <Text className="text-sm font-pregular">No Requests Yet</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8, gap: 8 }}>
              {requests.map((request, index) => (
                <TouchableOpacity key={index} onPress={() => router.navigate(`home/my-credential/status/${request.request_number}`)} activeOpacity={0.7} className="bg-white p-4 rounded-xl space-y-4">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-pregular">Request No.: {request.request_number}</Text>
                    <Text className={`text-sm font-pmedium capitalize ${request.request_status === 'review' && 'text-yellow-500' || request.request_status === 'process' && 'text-cyan-500' || request.request_status === 'receive' && 'text-indigo-500'}`}>{request.request_status === 'review' && 'To Review' || request.request_status === 'process' && 'In Process' || request.request_status === 'receive' && 'To Receive'}</Text>
                  </View>
                  <Text className="text-sm font-pregular">{request.request_credential.credential.credential_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </>
  )
}

export default MyCredentialStatus