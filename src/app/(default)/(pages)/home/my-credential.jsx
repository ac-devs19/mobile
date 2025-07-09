import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { FAB, List } from "react-native-paper";
import Review from "../../../../assets/images/review.png";
import Pay from "../../../../assets/images/pay.png";
import Process from "../../../../assets/images/process.png";
import Receive from "../../../../assets/images/receive.png";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { setName } from "../../../../components/Name";
import { useState } from "react";
import { useCallback } from "react";
import axios from "../../../../api/axios";
import { LoadingScreen } from "../../../../components/Dialog";

const tabs = ["To Review", "To Pay", "In Process", "To Receive"];
const status = ["review", "pay", "process", "receive"];
const icons = [Review, Pay, Process, Receive];

const MyCredential = () => {
  const [requestCount, setRequestCount] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentStatus, getPaymentStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadCount = async () => {
        setLoading(true);
        await getCount();
        await getPayment();
        setLoading(false);
      };
      loadCount();
    }, [])
  );

  const getCount = async () => {
    await axios
      .get("/student/get-request-count", {
        params: { status },
      })
      .then(({ data }) => {
        setRequestCount(data);
      });
  };

  const getPayment = async () => {
    await axios.get("/student/get-payment-status").then(({ data }) => {
      getPaymentStatus(data);
    });
  };

  const enableDate = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    const isWeekday = day >= 1 && day <= 5;
    const isBusinessHours = hour >= 8 && hour < 17;

    return isWeekday && isBusinessHours;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getCount();
    await getPayment();
    setRefreshing(false);
  };

  return (
    <>
      <LoadingScreen visible={loading} />
      <View className="flex-1">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#DBEAFE80",
            paddingHorizontal: 16,
            gap: 16,
            paddingTop: 16,
            paddingBottom: 90,
          }}
        >
          {tabs.map((tab, index) => (
            <List.Item
              onPress={() => {
                router.navigate(`/home/my-credential/${status[index]}`);
                setName(tab);
              }}
              key={index}
              title={() => <Text className="text-sm font-pmedium">{tab}</Text>}
              left={(props) => (
                <Image
                  {...props}
                  source={icons[index]}
                  resizeMode="contain"
                  className="w-14 h-14"
                />
              )}
              right={(props) => (
                <View className="flex-row items-center">
                  {requestCount[status[index]] > 0 && (
                    <View className="bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                      <Text className="text-xs font-pregular text-white">
                        {requestCount[status[index]]}
                      </Text>
                    </View>
                  )}
                  <Ionicons
                    {...props}
                    name="chevron-forward-outline"
                    size={20}
                  />
                </View>
              )}
              borderless
              className="bg-white rounded-xl"
            />
          ))}
        </ScrollView>

        <FAB
          onPress={() => {
            if (paymentStatus === "yes") {
              router.navigate("home/my-credential/request");
            } else {
              Alert.alert(
                "Alert!",
                "You can't request yet, Please pay your pending request!"
              );
            }
            // if (enableDate()) {
            //   if (paymentStatus === 'yes') {
            //     router.navigate('home/my-credential/request')
            //   } else {
            //     Alert.alert('Alert!', "You can't request yet, Please pay your pending request!")
            //   }
            // } else {
            //   Alert.alert('Note!', 'You can request a credential/s on weekdays between 8 AM and 5 PM')
            // }
            // router.navigate('home/my-credential/request')
          }}
          icon="plus"
          label="Request Credentials"
          className="absolute bottom-4 right-4"
          style={{ borderRadius: 12, backgroundColor: "#3b82f6" }}
          color="white"
        />
      </View>
    </>
  );
};

export default MyCredential;
