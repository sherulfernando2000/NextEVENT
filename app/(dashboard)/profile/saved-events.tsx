import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";

const SavedEventsScreen = () => {
  const router = useRouter();

  // Dummy saved events data
  const [savedEvents] = useState([
    {
      id: 1,
      title: "Summer Music Festival 2024",
      date: "2024-07-15T18:00:00Z",
      location: "Central Park, New York",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
      price: 75.99,
      category: "Music"
    },
    {
      id: 2,
      title: "Tech Conference: AI & Innovation",
      date: "2024-09-22T09:00:00Z",
      location: "Convention Center, San Francisco",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
      price: 299.00,
      category: "Technology"
    },
    {
      id: 3,
      title: "Food & Wine Tasting Evening",
      date: "2024-06-08T19:30:00Z",
      location: "Downtown Wine Bar, Chicago",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
      price: 125.50,
      category: "Food & Drink"
    },
    // {
    //   id: 4,
    //   title: "Art Gallery Opening",
    //   date: "2024-05-25T17:00:00Z",
    //   location: "Gallery District, Los Angeles",
    //   image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    //   price: 25.00,
    //   category: "Art"
    // }
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleEventPress = (eventId: number) => {
    // Navigate to event details
    console.log(`Navigate to event ${eventId}`);
  };

  const handleUnsaveEvent = (eventId: number) => {
    // Remove from saved events
    console.log(`Unsave event ${eventId}`);
  };

  return (
    <View className="flex-1 bg-black pb-10">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-1 pb-8">
        {/* Back Button */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <Text className="text-white text-xl font-bold flex-1 text-center">
          Saved Events
        </Text>

        {/* Menu Button */}
        <TouchableOpacity className="p-2 -mr-2">
          <Ionicons name="ellipsis-vertical" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Events Count */}
      <View className="px-4 pb-4">
        <Text className="text-gray-400 text-base">
          {savedEvents.length} saved events
        </Text>
      </View>

      {/* Events List */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {savedEvents.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            className="bg-gray-900 rounded-2xl mb-4 overflow-hidden"
            onPress={() => handleEventPress(event.id)}
          >
            <View className="relative">
              {/* Event Image */}
              <Image
                source={{ uri: event.image }}
                className="w-full h-48"
                resizeMode="cover"
              />
              
              {/* Date Badge */}
              <View className="absolute top-3 left-3 bg-[#702963] rounded-lg px-3 py-2">
                <Text className="text-white text-xs font-semibold uppercase">
                  {formatDate(event.date).split(' ')[0]}
                </Text>
                <Text className="text-white text-sm font-bold">
                  {formatDate(event.date).split(' ')[1]}
                </Text>
              </View>

              {/* Unsave Button */}
              <TouchableOpacity
                className="absolute top-3 right-3 bg-black/60 rounded-full p-2"
                onPress={() => handleUnsaveEvent(event.id)}
              >
                <Ionicons name="heart" size={20} color="#702963" />
              </TouchableOpacity>

              {/* Category Badge */}
              <View className="absolute bottom-3 left-3 bg-black/70 rounded-full px-3 py-1">
                <Text className="text-white text-xs font-medium">
                  {event.category}
                </Text>
              </View>
            </View>

            {/* Event Details */}
            <View className="p-4">
              <Text className="text-white text-lg font-bold mb-2" numberOfLines={2}>
                {event.title}
              </Text>
              
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-2 flex-1" numberOfLines={1}>
                  {event.location}
                </Text>
              </View>

              <View className="flex-row items-center mb-3">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-2">
                  {formatTime(event.date)}
                </Text>
              </View>

              {/* Price and Action Row */}
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-xs">From</Text>
                  <Text className="text-[#702963] text-lg font-bold">
                    ${event.price}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  className="bg-[#702963] rounded-full px-6 py-2"
                  onPress={() => handleEventPress(event.id)}
                >
                  <Text className="text-white font-semibold">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State (if no events) */}
        {savedEvents.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-gray-900 rounded-full p-6 mb-4">
              <Ionicons name="heart-outline" size={48} color="#702963" />
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
              No Saved Events
            </Text>
            <Text className="text-gray-400 text-center text-base mb-6 px-8">
              Events you save will appear here. Start exploring and save your favorites!
            </Text>
            <TouchableOpacity 
              className="bg-[#702963] rounded-full px-6 py-3"
              onPress={() => router.push('/explore')}
            >
              <Text className="text-white font-semibold">Explore Events</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
};

export default SavedEventsScreen;