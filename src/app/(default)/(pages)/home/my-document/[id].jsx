import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { Banner, Button, FAB, IconButton, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import ImageView from "react-native-image-viewing";
import axios from "../../../../../api/axios";
import { LoadingScreen } from "../../../../../components/Dialog";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { useAuthContext } from "../../../../../contexts/AuthContext";
import * as FileSystem from "expo-file-system";

const { width } = Dimensions.get("window");

const MyDocumentId = () => {
  const { url } = useAuthContext();
  const { id } = useLocalSearchParams();
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [softCopy, setSoftCopy] = useState({});
  const [reupload, setReupload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const selectedSoftCopy = softCopy.record?.map((copy) => ({
    uri: url + copy.uri,
  }));
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const [refreshing, setRefreshing] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  const clickView = async (index) => {
    setImageIndex(index);
    setIsVisible(true);
  };

  const compressImage = async (uri) => {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: width * 2 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result;
  };

  const detectBlur = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      const fileSizeKB = fileInfo.size / 1024;

      // Basic clarity check: if size too small (e.g., < 100 KB), assume blurry or compressed
      if (fileSizeKB < 100) {
        return true; // blurry
      }

      return false; // not blurry
    } catch (error) {
      console.log("Error detecting blur:", error);
      return false; // assume not blurry if check fails
    }
  };

  const openCamera = async () => {
    let result;
    let capturedImages = [];

    do {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const compressedImage = await compressImage(result.assets[0].uri);
        const isBlurry = await detectBlur(compressedImage.uri);

        if (isBlurry) {
          await new Promise((resolve) => {
            Alert.alert(
              "Image too blurry",
              "The photo appears unclear. Please retake the image.",
              [{ text: "OK", onPress: resolve }]
            );
          });
          continue; // skip saving this image
        }

        capturedImages.push({ uri: compressedImage.uri });
      }

      if (!result.canceled) {
        const takeAnother = await new Promise((resolve) => {
          Alert.alert(
            "Take Another Photo?",
            "Do you want to capture another photo?",
            [
              { text: "No", onPress: () => resolve(false) },
              { text: "Yes", onPress: () => resolve(true) },
            ]
          );
        });

        if (!takeAnother) break;
      }
    } while (!result.canceled);

    if (capturedImages.length > 0) {
      setImages((prevImages) => [...prevImages, ...capturedImages]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = await Promise.all(
        result.assets.map(async (asset) => {
          const compressedImage = await compressImage(asset.uri);
          return { uri: compressedImage.uri };
        })
      );
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  useEffect(() => {
    loadSoftCopy();
  }, []);

  const loadSoftCopy = async () => {
    setLoading(true);
    await getSoftCopy();
    setLoading(false);
  };

  const getSoftCopy = async () => {
    await axios
      .get("/student/get-softcopy", {
        params: { document_id: id },
      })
      .then(({ data }) => {
        setSoftCopy(data);
      });
  };

  const handleSubmit = async () => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("document_id", id);
    images.forEach((image, index) => {
      formData.append(`images[]`, {
        uri: image.uri,
        type: "image/jpeg",
        name: `image${index}.jpg`,
      });
    });
    await axios
      .post("/student/submit-requirement", formData)
      .then(() => {
        setImages([]);
        loadSoftCopy();
      })
      .catch((error) => {
        console.log(error.response.data);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const handleReSubmit = async (submit_id) => {
    setBtnLoading(true);
    const formData = new FormData();
    formData.append("submit_id", submit_id);
    formData.append("document_id", id);
    images.forEach((image, index) => {
      formData.append(`images[]`, {
        uri: image.uri,
        type: "image/jpeg",
        name: `image${index}.jpg`,
      });
    });
    await axios
      .post("/student/resubmit-requirement", formData)
      .then(() => {
        setReupload(!reupload);
        setImages([]);
        loadSoftCopy();
        if (!bannerVisible) {
          setBannerVisible(true);
        }
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getSoftCopy();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-100/50">
        <LoadingScreen visible={loading} />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <LoadingScreen visible={btnLoading} />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#DBEAFE80",
          padding: 8,
        }}
      >
        {softCopy.record && softCopy.submit_status !== "confirm" && (
          <Banner
            className={`bg-white rounded-xl shadow-none ${
              bannerVisible ? "mb-2" : "mb-0"
            }`}
            visible={bannerVisible}
            actions={[
              {
                label: <Text className="font-pregular text-sm">Close</Text>,
                onPress: () => setBannerVisible(false),
              },
            ]}
            icon={({ size }) => (
              <Ionicons
                name="alert-circle-outline"
                size={size}
                color="orange"
              />
            )}
          >
            <Text className="font-pregular text-sm">
              {(softCopy.submit_status === "review" &&
                "Note: Please submit your document/s manually in the registrar's office.") ||
                (softCopy.submit_status === "resubmit" &&
                  "Note: Please Re-Upload your document/s and submit manually in the registrar's office.")}
            </Text>
          </Banner>
        )}
        {softCopy.record && !reupload && (
          <View className="space-y-2">
            <View>
              <Text
                className={`rounded-t-xl p-4 font-pmedium text-white capitalize ${
                  (softCopy.submit_status === "confirm" && "bg-green-500") ||
                  (softCopy.submit_status === "review" && "bg-yellow-500") ||
                  (softCopy.submit_status === "resubmit" && "bg-red-500")
                }`}
              >
                {(softCopy.submit_status === "review" && "To Review") ||
                  (softCopy.submit_status === "confirm" && "Confirmed") ||
                  (softCopy.submit_status === "resubmit" && "Resubmit")}
              </Text>
              <View className="bg-white p-4 rounded-b-xl space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text className="font-pregular text-sm">Date Submitted:</Text>
                  <Text className="font-pregular text-sm">
                    {formatDate(softCopy.created_at)}
                  </Text>
                </View>
                {softCopy.submit_status === "confirm" && (
                  <View className="flex-row items-center justify-between">
                    <Text className="font-pregular text-sm">
                      Date Confirmed:
                    </Text>
                    <Text className="font-pregular text-sm">
                      {formatDate(softCopy.updated_at)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {softCopy.submit_status === "resubmit" && (
              <View className="bg-white space-y-4 p-4 rounded-xl">
                <Text className="font-pmedium text-sm">Reason</Text>
                <Text className="text-sm font-pregular">
                  {softCopy.message}
                </Text>
              </View>
            )}
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
              {softCopy.record?.map((copy, index) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={index}
                  onPress={() => clickView(index)}
                >
                  <Image
                    source={{ uri: url + copy.uri }}
                    contentFit="cover"
                    transition={1000}
                    style={{
                      width: width / 2 - 12,
                      height: 160,
                    }}
                    className="rounded-lg"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {images && (
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {images &&
              images.map((image, index) => (
                <View key={index} className="relative">
                  <IconButton
                    onPress={() =>
                      setImages((prevImages) =>
                        prevImages.filter((_, i) => i !== index)
                      )
                    }
                    icon="close"
                    iconColor="red"
                    size={20}
                    className="absolute z-50 right-0"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => clickView(index)}
                  >
                    <Image
                      source={image}
                      contentFit="cover"
                      transition={1000}
                      style={{
                        width: width / 2 - 12,
                        height: 160,
                      }}
                      className="rounded-xl"
                    />
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        )}
        {((!softCopy.record && !images[0]) || reupload) && (
          <View
            className={`h-full justify-center items-center space-y-6 ${
              images[0] && "hidden"
            }`}
          >
            <Text className="font-pregular text-sm">
              Please Upload your Document/s
            </Text>
            <View className="justify-center items-center space-y-3">
              <Button onPress={openCamera} icon="camera" mode="contained">
                <Text className="text-sm font-pmedium">Take a Photo</Text>
              </Button>
              <Text className="text-sm font-pregular">or</Text>
              <Button onPress={pickImage} icon="image" mode="outlined">
                <Text className="text-sm font-pmedium">Select a Photo</Text>
              </Button>
            </View>
          </View>
        )}
      </ScrollView>

      {images[0] && (
        <View className={(loading || btnLoading) && "hidden"}>
          <Button
            onPress={() => {
              softCopy.submit_status === "resubmit"
                ? handleReSubmit(softCopy.id)
                : handleSubmit();
            }}
            mode="contained"
            contentStyle={{ height: 56 }}
            className="absolute bottom-4 left-4 right-20 rounded-xl"
          >
            <Text className="text-sm font-pmedium">
              {softCopy.submit_status === "resubmit" ? "Re-Submit" : "Submit"}
            </Text>
          </Button>
          <View className="absolute bottom-4 right-4">
            <Portal>
              <FAB.Group
                open={open}
                visible
                icon={open ? "chevron-down" : "chevron-up"}
                actions={[
                  {
                    icon: "camera",
                    label: "Take a Photo",
                    onPress: () => openCamera(),
                    labelStyle: { fontFamily: "Poppins-Medium", fontSize: 14 },
                  },
                  {
                    icon: "image",
                    label: "Select a Photo",
                    onPress: () => pickImage(),
                    labelStyle: { fontFamily: "Poppins-Medium", fontSize: 14 },
                  },
                ]}
                onStateChange={onStateChange}
                fabStyle={{ borderRadius: 12, backgroundColor: "#3b82f6" }}
                color="white"
                className={(loading || btnLoading) && "hidden"}
              />
            </Portal>
          </View>
        </View>
      )}

      {softCopy.submit_status === "resubmit" && !reupload && (
        <FAB
          icon="camera"
          label="Re-Upload"
          className="absolute bottom-4 right-4"
          onPress={() => setReupload(!reupload)}
          style={{ borderRadius: 12, backgroundColor: "#3b82f6" }}
          color="white"
        />
      )}

      <ImageView
        images={
          !reupload
            ? (softCopy.record && selectedSoftCopy) || (images[0] && images)
            : images[0] && images
        }
        imageIndex={imageIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default MyDocumentId;
