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
        tabBarActiveBackgroundColor:COLORS.white,
        tabBarInactiveTintColor: "#000000",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ccc"
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
