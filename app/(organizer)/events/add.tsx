import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Platform,
  Alert
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { COLORS } from "@/constants"
import { useNavigation, useRouter } from "expo-router"
import axios from "axios"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from '@react-native-picker/picker'
import { addEvent } from "@/services/eventService"

const AddEventScreen = () => {
  const navigation = useNavigation()

  const [title, setTitle] = useState("")
  const [startingTime, setStartingTime] = useState("")
  const [date, setDate] = useState(new Date())
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState(0)
  const [type, setType] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadImage, setUploadImage] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(0)
  const router = useRouter()


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setUploadImage(result.assets[0])
    }
  }

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) setDate(selectedDate)
  }

  const onChangeTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false)
    if (selectedDate) setDate(selectedDate)
  }

  const urlUploaded = async () => {
    if (!uploadImage || !uploadImage.uri) {
      alert("Please select an image first!");
      return null;
    }

    const formData = new FormData();

    // Different handling for mobile vs web
    if (Platform.OS === 'web') {
      const response = await fetch(uploadImage.uri);
      const blob = await response.blob();
      formData.append("file", blob, uploadImage.fileName || "event-image.jpg");
    } else {
      // For mobile (iOS/Android)
      formData.append("file", {
        uri: uploadImage.uri,
        type: uploadImage.mimeType || 'image/jpeg',
        name: uploadImage.fileName || 'event-image.jpg',
      });
    }

    formData.append("upload_preset", "NextEVENT");

    try {
      
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzkqfsaxo/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );

      
      return res.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed!");
      
      return null;
    }
  };


  const handleSave = async () => {
    try {
      setLoading(true)
      const uploadImageUrl = await urlUploaded();
      console.log(uploadImageUrl)

      const newEvent = {
        title,
        imageUrl: uploadImageUrl,
        date,
        startingTime: date,
        description,
        location,
        ticketprice: price,
        type,
        ticketQuantity,
      }

      const docRef = await addEvent(newEvent)
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", "Event Saved successfully");
      router.push('/(organizer)/events')
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false)
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 5,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 16,
          }}
        >
          Add Event
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Picker */}
        <TouchableOpacity
          onPress={pickImage}
          className="bg-gray-800 rounded-2xl h-48 justify-center items-center mb-6"
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-2xl"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="image-outline" size={40} color="gray" />
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-white mb-2">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter event title"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />
        {/* Starting Date */}

        {/* <Text className="text-white mb-2">Date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          placeholder="e.g. 2025-09-20"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        /> */}

        {/* Starting Time */}
        {/* <Text className="text-white mb-2">Starting Time</Text>
        <TextInput
          value={startingTime}
          onChangeText={setStartingTime}
          placeholder="e.g. 2025-09-20 18:00"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        /> */}

        <Text className="text-white mb-2">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-gray-900 p-4 rounded-xl mb-4"
        >
          <Text className="text-white">{date.toDateString()}</Text>
        </TouchableOpacity>

        {/* Time */}
        <Text className="text-white mb-2">Starting Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="bg-gray-900 p-4 rounded-xl mb-4"
        >
          <Text className="text-white">{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}

        {/* Description */}
        <Text className="text-white mb-2">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

        {/* Location */}
        <Text className="text-white mb-2">Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

        {/* Price */}
        <Text className="text-white mb-2">Price</Text>
        <TextInput
          value={price.toString()}
          onChangeText={(text) => {
            setPrice(Number(text))
          }}
          placeholder="Enter price"
          keyboardType="numeric"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

        {/* Qty */}
        <Text className="text-white mb-2">Qty</Text>
        <TextInput
          value={ticketQuantity.toString()}
          onChangeText={(text) => {
            // Allow only numbers
            const numericValue = text.replace(/[^0-9]/g, "");
            setTicketQuantity(numericValue === "" ? 0 : Number(numericValue));
          }}
          placeholder="Enter quantity"
          keyboardType="numeric"   // brings up number pad
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

        {/* Type */}
        <Text className="text-white mb-2">Type</Text>
        <View className="bg-gray-900 rounded-xl mb-6">
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
            dropdownIconColor="#fff" // makes arrow white
            style={{
              color: 'white'

            }}
          >
            <Picker.Item label="Select type..." value="" />
            <Picker.Item label="Comedy" value="Comedy" />
            <Picker.Item label="Tech" value="Tech" />
            <Picker.Item label="Drama" value="Drama" />
            <Picker.Item label="Cinema" value="Cinema" />
            <Picker.Item label="Standup Comedy" value="Standup Comedy" />
            <Picker.Item label="Music" value="Music" />
            <Picker.Item label="Sports" value="Sports" />
          </Picker>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: COLORS.purple,

          }}

          className={` p-4 rounded-2xl mb-20`}
        >
          {
            loading ? (
              <Text className="text-white text-center text-lg font-bold">
                Processing.....
              </Text>
            ) : (
              <Text className="text-white text-center text-lg font-bold">
                Save Event
              </Text>
            )
          }

        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  )
}

export default AddEventScreen
