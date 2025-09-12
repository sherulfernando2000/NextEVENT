import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { COLORS } from "@/constants"
import { useNavigation } from "expo-router"

const AddEventScreen = () => {
  const navigation = useNavigation()

  const [title, setTitle] = useState("")
  const [startingTime, setStartingTime] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [price, setPrice] = useState("")
  const [type, setType] = useState("")
  const [image, setImage] = useState<string | null>(null)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const handleSave = () => {
    const newEvent = {
      title,
      image,
      startingTime,
      description,
      location,
      price,
      type
    }
    console.log("Event Added:", newEvent)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
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

        {/* Starting Time */}
        <Text className="text-white mb-2">Starting Time</Text>
        <TextInput
          value={startingTime}
          onChangeText={setStartingTime}
          placeholder="e.g. 2025-09-20 18:00"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

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
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          keyboardType="numeric"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-4"
        />

        {/* Type */}
        <Text className="text-white mb-2">Type</Text>
        <TextInput
          value={type}
          onChangeText={setType}
          placeholder="e.g. Concert, Meetup"
          placeholderTextColor="#888"
          className="bg-gray-900 text-white p-4 rounded-xl mb-6"
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: COLORS.purple,

          }}
        
          className={` p-4 rounded-2xl mb-10`}
        >
          <Text className="text-white text-center text-lg font-bold">
            Save Event
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddEventScreen
