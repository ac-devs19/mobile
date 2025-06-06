import { Redirect, router } from "expo-router"
import { Animated, Dimensions, FlatList, Image, Text, View } from "react-native"
import { Button } from "react-native-paper"
import Logo from '../assets/images/OCC_LOGO.png'
import { useAuthContext } from "../contexts/AuthContext"
import ob1 from '../assets/images/ob1.png'
import ob2 from '../assets/images/ob2.png'
import ob3 from '../assets/images/ob3.png'
import folder from '../assets/images/folders.png'
import { useRef, useState } from "react"

const { width } = Dimensions.get('window')

const Welcome = () => {
  const { user } = useAuthContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current

  if (user) {
    return <Redirect href="/home" />
  }

  const slides = [
    {
      key: 'slide1',
      component: (
        <View style={{ flexGrow: 1, width: width }} className="bg-indigo-500">
          <View className="relative items-center">
            <Image source={Logo} resizeMode="contain" className="absolute top-20 w-28 h-28" />
          </View>
          <View className="flex-1 justify-end">
            <View className="items-center justify-center mb-10">
              <Image source={ob1} resizeMode="contain" className="absolute w-72 h-72 z-10" />
            </View>
            <View className="bg-white h-[50%] rounded-t-3xl p-4">
              <View className="space-y-6 mt-20">
                <Text className="uppercase font-pregular text-indigo-500 text-lg text-center tracking-widest">Opol Community College</Text>
                <View className="flex-row justify-center items-center space-x-1.5">
                  <Text className="font-pbold text-gray-800 text-4xl">Welcome</Text>
                  <Text style={{ fontFamily: "BrittanySignature" }} className="py-4 text-4xl text-indigo-500">OCCians!</Text>
                </View>
                <Text className="font-pregular text-gray-700 text-justify">{`"A school on the rise in giving quality education yet affordable education to Opolanons and nearby communities."`}</Text>
              </View>
            </View>
          </View>
        </View>
      )
    },
    {
      key: 'slide2',
      component: (
        <View style={{ flexGrow: 1, width: width }} className="bg-indigo-500">
          <View className="px-4 space-y-6">
            <View className="flex-row items-center pt-14 space-x-2">
              <Image source={Logo} resizeMode="contain" className="w-16 h-16" />
              <View className="w-1 bg-white h-14 rounded-sm" />
              <View>
                <Text className="text-white font-pmedium tracking-widest">Opol</Text>
                <Text className="text-white font-pmedium tracking-widest">Community</Text>
                <Text className="text-white font-pmedium tracking-widest">College</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-pbold text-white">Upload your</Text>
                <Text className="text-3xl font-pbold text-white">Documents</Text>
              </View>
              <Image source={folder} resizeMode="contain" className="w-28 h-28" />
            </View>
            <Text className="font-pregular text-white text-justify">{`"Uploading your documents through our mobile app is quick and easy. Start by navigating to the "My Documents" section."`}</Text>
          </View>
          <View className="flex-1 justify-end">
            <View className="items-center mb-20">
              <Image source={ob2} resizeMode="contain" className="absolute w-[300px] h-[300px] z-10" />
            </View>
            <View className="bg-white h-[70%] rounded-t-3xl p-6"></View>
          </View>
        </View>
      )
    },
    {
      key: 'slide3',
      component: (
        <View style={{ flexGrow: 1, width: width }} className="bg-indigo-500">
          <View className="px-4 space-y-6">
            <View className="flex-row items-center pt-14 space-x-2">
              <Image source={Logo} resizeMode="contain" className="w-16 h-16" />
              <View className="w-1 bg-white h-14 rounded-sm" />
              <View>
                <Text className="text-white font-pmedium tracking-widest">Opol</Text>
                <Text className="text-white font-pmedium tracking-widest">Community</Text>
                <Text className="text-white font-pmedium tracking-widest">College</Text>
              </View>
            </View>
          </View>
          <View className="flex-1 justify-end">
            <View className="items-center mb-[230px]">
              <View className="absolute">
                <Image source={ob3} resizeMode="contain" className="w-72 h-72 z-10" />
                <Text className="text-indigo-500 font-pregular text-center z-10">{`"Your Credentials, Your Choice"`}</Text>
              </View>
            </View>
            <View className="bg-white h-[60%] rounded-t-3xl p-6">
              <View className="space-y-6 mt-20">
                <Text className="text-3xl font-pbold text-gray-800">Select your preferred Credentials</Text>
                <Text className="font-pregular text-gray-700 text-justify">{`"Once you’ve already uploaded your documents, you can now select/choose your desired credentials. To start simply navigate to the “My Credentials” section."`}</Text>
              </View>
            </View>
          </View>
          <Button onPress={() => router.navigate('/sign-in')} uppercase mode='contained' contentStyle={{ height: 50 }} className="absolute bottom-4 inset-x-4 rounded-xl">
            <Text className="text-sm font-pbold">Get Started</Text>
          </Button>
        </View>
      )
    }
  ]

  const renderScene = ({ item }) => item.component

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  )

  const updateCurrentIndex = (event) => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        onScroll={handleScroll}
        onMomentumScrollEnd={updateCurrentIndex}
        renderItem={renderScene}
        keyExtractor={(item) => item.key}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
        {slides.map((_, index) => {
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp"
          })

          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp"
          })

          return (
            <Animated.View
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: "#3b82f6",
                opacity,
                transform: [{ scale }]
              }}
            />
          )
        })}
      </View>
    </View>
  )
}

export default Welcome