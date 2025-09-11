import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

const SavedEventsScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 20,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Saved Events
        </Text>

       
        
      </View>

      {/* Body */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl">Your Saved Events</Text>
      </View>
    </View>
  );
};

export default SavedEventsScreen;
