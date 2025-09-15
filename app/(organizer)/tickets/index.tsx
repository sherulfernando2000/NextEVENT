import { COLORS } from "@/constants"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native"

// Dummy data (replace with API call)
const dummyEventPurchases = [
  {
    eventId: "1",
    title: "Music Concert",
    date: "2025-09-20",
    ticketsSold: 25,
    totalRevenue: 2500,
    buyers: [
      { id: "b1", name: "Alice", qty: 2 },
      { id: "b2", name: "Bob", qty: 3 }
    ]
  },
  {
    eventId: "2",
    title: "Tech Meetup",
    date: "2025-10-02",
    ticketsSold: 10,
    totalRevenue: 1000,
    buyers: [
      { id: "b3", name: "Charlie", qty: 1 },
      { id: "b4", name: "David", qty: 2 }
    ]
  }
]

const PurchasesByEventScreen = () => {
  const navigation = useNavigation()
  const [events, setEvents] = useState(dummyEventPurchases)

  useEffect(() => {
    // TODO: Fetch real data from backend
    // fetchPurchasesByEvent().then(setEvents)
  }, [])

  const renderEvent = ({ item }: any) => (
    <View className="bg-gray-900 p-2 rounded-2xl mb-4">
      {/* Event Header */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-xl font-bold">{item.title}</Text>
        <Text className="text-gray-400">{item.date}</Text>
      </View>

      {/* Stats */}
      <View className="flex-row items-center justify-center mb-4">
        
        <Text className="w-1/2 pl-2 text-green-400">
          Tickets Sold: {item?.ticketsSold ?? 0}
        </Text>
      
        <Text className="w-1/2 pl-10 text-purple-400">Revenue: ${item.totalRevenue}</Text>
      </View>

      {/* Buyers */}
      <View className="bg-gray-800 p-3 rounded-lg">
        <Text className="text-white font-semibold mb-2">Buyers</Text>
        {item.buyers.map((buyer: any) => (
          <View
            key={buyer.id}
            className="flex-row justify-between border-b border-gray-700 py-1"
          >
            <Text className="w-1/2   text-gray-300">{buyer.name}</Text>
            <Text className="w-1/2 pl-28 text-gray-400">Qty: {buyer.qty}</Text>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold bg-gray-900">Ticket Purchases</Text>
        <Ionicons name="analytics-outline" size={24} color="white" />
      </View>

      {/* Events with Purchases */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.eventId}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  )
}

export default PurchasesByEventScreen
