import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import React, { useState } from "react"
import QRCode from "react-native-qrcode-svg"
import { COLORS } from "@/constants"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"

const dummyTickets = {
  upcoming: [
    {
      id: "1",
      event: "Music Concert",
      date: "2025-09-20",
      bookingId: "UP123456"
    },
    {
      id: "2",
      event: "Tech Meetup",
      date: "2025-10-02",
      bookingId: "UP654321"
    },
    {
      id: "3",
      event: "Tech Meetup",
      date: "2025-10-02",
      bookingId: "UP654321"
    },
    {
      id: "4",
      event: "Tech Meetup",
      date: "2025-10-02",
      bookingId: "UP654321"
    }
  ],
  past: [
    {
      id: "3",
      event: "Art Expo",
      date: "2025-07-15",
      bookingId: "PA987654"
    }
  ]
}

const TicketsScreen = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const navigation = useNavigation()

  const renderTicket = ({ item }: any) => (
    <View className="bg-gray-800 p-4 m-2 rounded-2xl">
      <Text className="text-xl text-white font-bold">{item.event}</Text>
      <Text className="text-gray-300">Date: {item.date}</Text>
      <View className="mt-4 self-center">
        <QRCode value={item.bookingId} size={120} />
      </View>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Tickets
        </Text>

        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around mb-4">
        <TouchableOpacity onPress={() => setActiveTab("upcoming")}>
          <Text className={`text-lg ${activeTab === "upcoming" ? "text-white font-bold" : "text-gray-400"}`}>
            Recent
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("past")}>
          <Text className={`text-lg ${activeTab === "past" ? "text-white font-bold" : "text-gray-400"}`}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>


        {/* Tickets List */}
        <FlatList
          data={activeTab === "upcoming" ? dummyTickets.upcoming : dummyTickets.past}
          keyExtractor={(item) => item.id}
          renderItem={renderTicket}
          ListEmptyComponent={
            <Text className="text-center text-gray-500">No {activeTab} tickets</Text>
          }
        />

      </ScrollView>


    </SafeAreaView>
  )
}

export default TicketsScreen
