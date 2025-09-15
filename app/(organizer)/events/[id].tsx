import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, useRouter } from "expo-router";
import { getEventById, updateEvent } from "@/services/eventService";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

const EventDetailScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Separate state for form inputs
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [startingTime, setStartingTime] = useState(new Date());
  const [imageUrl, setImageUrl] = useState("");

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchEvent = async () => {
    try {
      const fetchedEvent = await getEventById(id);
      console.log('fetchevent', fetchedEvent);
      setEvent(fetchedEvent);
      
      // Initialize form fields with fetched data
      if (fetchedEvent) {
        setTitle(fetchedEvent.title || "");
        setLocation(fetchedEvent.location || "");
        setPrice(fetchedEvent.ticketprice?.toString() || "");
        setType(fetchedEvent.type || "");
        setDescription(fetchedEvent.description || "");
        setImageUrl(fetchedEvent.imageUrl || "");
        
        // Handle date conversion
        const eventDate = fetchedEvent.startingTime 
          ? new Date(fetchedEvent.startingTime) 
          : new Date();
        setStartingTime(eventDate);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      Alert.alert("Error", "Failed to load event details");
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleUpdate = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Location is required");
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert("Error", "Valid price is required");
      return;
    }

    const updatedEvent = {
      ...event,
      title: title.trim(),
      imageUrl: event.imageUrl,
      location: location.trim(),
      ticketprice: parseFloat(price),
      type: type.trim(),
      description: description.trim(),
      startingTime: startingTime,
      date: startingTime,
      ticketQuantity: event.ticketQuantity
    };

    console.log("Updated Event:", updatedEvent);
    
    try {
      setLoading(true);
      const resp = await updateEvent(event.id, updatedEvent);
      Alert.alert("Success", "Event updated successfully");
      router.push("/(organizer)/events");
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Event not updated");
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (pickerEvent: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Combine selected date with existing time
      const newDateTime = new Date(startingTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setStartingTime(newDateTime);
    }
  };

  const onChangeTime = (pickerEvent: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Combine existing date with selected time
      const newDateTime = new Date(startingTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setStartingTime(newDateTime);
    }
  };

  // Show loading if event hasn't loaded yet
  if (!event) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black pb-5">
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
          <Image 
            source={{ uri: imageUrl || 'https://placehold.co/600x400/png' }} 
            className="w-full h-full" 
            resizeMode="cover" 
          />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-gray-300 mb-1">Title</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={title}
          onChangeText={setTitle}
          placeholder="Event Title"
          placeholderTextColor="#888"
        />

        {/* Date */}
        <Text className="text-white mb-2">Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-gray-900 p-4 rounded-xl mb-4"
        >
          <Text className="text-white">
            {moment(startingTime).format("YYYY-MM-DD")}
          </Text>
        </TouchableOpacity>

        {/* Starting Time */}
        <Text className="text-white mb-2">Starting Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="bg-gray-900 p-4 rounded-xl mb-4"
        >
          <Text className="text-white">
            {moment(startingTime).format('h:mm A')}
          </Text>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={startingTime}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={startingTime}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}

        {/* Location */}
        <Text className="text-gray-300 mb-1">Location</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          placeholderTextColor="#888"
        />

        {/* Price */}
        <Text className="text-gray-300 mb-1">Price (LKR)</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={price}
          onChangeText={setPrice}
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor="#888"
        />

        {/* Type */}
        <Text className="text-gray-300 mb-1">Type</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-4"
          value={type}
          onChangeText={setType}
          placeholder="Conference, Workshop..."
          placeholderTextColor="#888"
        />

        {/* Description */}
        <Text className="text-gray-300 mb-1">Description</Text>
        <TextInput
          className="bg-gray-900 text-white rounded-lg p-3 mb-6"
          value={description}
          onChangeText={setDescription}
          placeholder="Event description..."
          placeholderTextColor="#888"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Update Button */}
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={loading}
          className={`${loading ? 'bg-purple-400' : 'bg-purple-600'} py-4 mb-4 rounded-xl items-center`}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? "Processing....." : "Update Event"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EventDetailScreen;