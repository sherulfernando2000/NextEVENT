import { View, Text } from "react-native"
import React from "react"
import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from "@/constants"

const tabs = [
  { label: "Home", name: "home", icon: "home-outline" },
  { label: "Events", name: "event", icon: "list-outline" },
  { label: "Ticket", name: "ticket", icon: "ticket-outline" },
  { label: "Profile", name: "profile", icon: "person-circle-outline" }
] as const

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.purple,
        // tabBarActiveBackgroundColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.transparentBlack,
          position: "absolute", // so border radius can show
          left: 0,
          right: 0,
          bottom: 0,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 60,
          paddingTop: 5,
          borderTopWidth: 0, // remove default border
          overflow: "hidden", // ensure children respect radius

        }
      }}
    >
      {/* (obj.name) ===  ({name}) */}
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} color={color} size={size} />
            )
          }}
        />
      ))}
    </Tabs>
  )
}

// tasks/index

export default DashboardLayout
