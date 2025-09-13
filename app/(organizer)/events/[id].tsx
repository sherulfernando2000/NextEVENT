import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams } from "expo-router";

const EventDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams(); // event id from route

  // Dummy event (replace with API fetch by ID)
  const [event, setEvent] = useState({
    title: "Tech Conference 2025",
    image: "https://placehold.co/600x400/png",
    startingTime: "2025-09-20 10:00 AM",
    description: "A conference bringing together developers, startups, and investors.",
    location: "Colombo, Sri Lanka",
    price: 1500,
    type: "Conference",
  });

  const handleUpdate = () => {
    // TODO: call API to update event
    console.log("Updated Event:", event);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-700">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Edit Event</Text>
        <View className="w-6" /> {/* spacer */}
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Image */}
        <TouchableOpacity className="w-full h-48 bg-gray-800 rounded-xl overflow-hidden mb-4">
          <Image source={{ uri: event.image }} className="w-full h-full" resizeMode="cover" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-gray-300 mb-1">Title</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={event.title}
          onChangeText={(text) => setEvent({ ...event, title: text })}
          placeholder="Event Title"
          placeholderTextColor="#888"
        />

        {/* Date / Time */}
        <Text className="text-gray-300 mb-1">Starting Time</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={event.startingTime}
          onChangeText={(text) => setEvent({ ...event, startingTime: text })}
          placeholder="YYYY-MM-DD HH:mm"
          placeholderTextColor="#888"
        />

        {/* Location */}
        <Text className="text-gray-300 mb-1">Location</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={event.location}
          onChangeText={(text) => setEvent({ ...event, location: text })}
          placeholder="Location"
          placeholderTextColor="#888"
        />

        {/* Price */}
        <Text className="text-gray-300 mb-1">Price (LKR)</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={event.price?.toString()}
          onChangeText={(text) => setEvent({ ...event, price: parseFloat(text) || 0 })}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        {/* Type */}
        <Text className="text-gray-300 mb-1">Type</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={event.type}
          onChangeText={(text) => setEvent({ ...event, type: text })}
          placeholder="Conference, Workshop..."
          placeholderTextColor="#888"
        />

        {/* Description */}
        <Text className="text-gray-300 mb-1">Description</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-6"
          value={event.description}
          onChangeText={(text) => setEvent({ ...event, description: text })}
          placeholder="Event description..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
        />

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-purple-600 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-lg">Update Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EventDetailScreen;
