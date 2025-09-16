import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import React from "react"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { logout } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"
import {avatar} from "../../../assets/images"

const ProfileScreen = () => {
  const router = useRouter()

  const handleLogout  = async () => {
    await logout()
    router.push("/(auth)/login")
  }

  const{user} = useAuth();

  return (
    <ScrollView className="flex-1 bg-black">
      {/* Header Section */}
      <View className="items-center mt-10 mb-6">
        <Image
          source={require('../../../assets/images/avatar_sherul.png')} 
          className="w-28 h-28 rounded-full border-4 border-gray-700"
        />
        <Text className="text-2xl font-bold text-white mt-3">{user?.email?.slice(0,6)}</Text>
        <Text className="text-gray-400 w-full text-center">{user?.email}</Text>
      </View>

      {/* Buttons Section */}
      <View className="px-6 space-y-4">
        <TouchableOpacity
          className=" p-4 rounded-2xl flex-row gap-2 w-full"
          onPress={() => router.push("/(dashboard)/profile/saved-events")}
        >
          <Ionicons name="heart-outline" size={24} color="white" />
          <Text className="text-white text-lg w-full"> Saved Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className=" p-4 rounded-2xl flex-row gap-2"
          onPress={() => router.push("/(organizer)/home")}
        >
          <Ionicons name="save-outline" size={24} color="white" />
          <Text className="text-white text-lg w-full">Organize</Text>
         
        </TouchableOpacity>
        

        <TouchableOpacity
          className="p-4 rounded-2xl hover:bg-white/10 flex-row gap-2"
          onPress={() => router.push("/(dashboard)/profile/about")}
        >
          
            <Ionicons name="information-circle-outline" size={24} color="white" />
            <Text className="text-white text-lg w-full"> About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 rounded-2xl flex-row gap-3"
          onPress={() => router.push("/(dashboard)/profile/settings")}
        >
            <Ionicons name="settings-outline" size={24} color="white" />
          <Text className="text-white text-lg w-full">Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 rounded-2xl flex-row gap-3"
          onPress={() => handleLogout()}
        >
            <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white text-lg w-full">Logout</Text>
        </TouchableOpacity>


      </View>
    </ScrollView>
  )
}

export default ProfileScreen
