import { COLORS } from "@/constants"
import { useAuth } from "@/context/AuthContext"
import { getEventsByUser } from "@/services/eventService"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import React, { useEffect, useState } from "react"
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { Event } from "@/types/types";
import { getTicketPurchasesByEvents } from "@/services/ticketService"

const PurchasesByEventScreen = () => {
  const navigation = useNavigation()
  const [events, setEvents] = useState<Event[]>([])
  const [eventIds, setEventIds] = useState<string[]>([])
  const [ticketPurchases, setTicketPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // First useEffect: Fetch events when component mounts
  useEffect(() => {
    const fetchEventsByUser = async () => {
      try {
        const events = await getEventsByUser(user ? user?.uid : "")
        console.log('events:', events)
        setEvents(events || [])
        
        const eventIds = events?.map((e) => e.id) || []
        console.log("eventIds", eventIds)
        setEventIds(eventIds)
      } catch (error) {
        console.error("Error fetching events:", error)
        setEventIds([])
      }
    }

    fetchEventsByUser()
  }, [user?.uid])

  // Second useEffect: Fetch tickets when eventIds changes
  useEffect(() => {
    const fetchTicketsByEvents = async () => {
      try {
        if (eventIds.length === 0) {
          setLoading(false)
          return
        }
        
        setLoading(true)
        const ticketPurchase = await getTicketPurchasesByEvents(eventIds)
        console.log("tickets", ticketPurchase)
        setTicketPurchases(ticketPurchase || [])
      } catch (error) {
        console.error("Error fetching tickets:", error)
        setTicketPurchases([])
      } finally {
        setLoading(false)
      }
    }

    if (eventIds.length > 0) {
      fetchTicketsByEvents()
    }
  }, [eventIds]) // This runs whenever eventIds changes

  // Get ticket purchases for a specific event
  const getTicketPurchasesForEvent = (eventId: string) => {
    return ticketPurchases.filter(purchase => purchase.eventId === eventId)
  }

  // Calculate total tickets sold for an event
  const getTotalTicketsSold = (eventId: string) => {
    const eventPurchases = getTicketPurchasesForEvent(eventId)
    return eventPurchases.reduce((total, purchase) => total + purchase.quantity, 0)
  }

  // Calculate total revenue for an event
  const getTotalRevenue = (eventId: string, ticketPrice: number) => {
    const totalSold = getTotalTicketsSold(eventId)
    return totalSold * ticketPrice
  }

  const renderEvent = ({ item }: any) => {
    const eventPurchases = getTicketPurchasesForEvent(item.id)
    const totalTicketsSold = getTotalTicketsSold(item.id)
    const totalRevenue = getTotalRevenue(item.id, item.ticketprice)

    return (
      <View className="bg-gray-900 rounded-2xl mb-6 overflow-hidden border border-gray-800">
        {/* Event Header */}
        <View className="p-5 border-b border-gray-800">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-4">
              <Text className="text-white text-xl font-bold mb-1">{item.title}</Text>
              <Text className="text-[#702963] text-sm font-medium uppercase tracking-wide">
                {item.type}
              </Text>
            </View>
            <View className="bg-[#702963] px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-semibold">
                {new Date(item.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1">{item.location}</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="p-5 bg-gray-800/50">
          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Tickets Sold
              </Text>
              <Text className="text-white text-2xl font-bold">
                {totalTicketsSold}
              </Text>
              <Text className="text-gray-500 text-xs">
                of {item.ticketQuantity} available
              </Text>
            </View>

            <View className="flex-1 items-center">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Revenue
              </Text>
              <Text className="text-[#702963] text-2xl font-bold">
                LKR {totalRevenue.toLocaleString()}
              </Text>
              <Text className="text-gray-500 text-xs">
                @ LKR {item.ticketprice} each
              </Text>
            </View>

            <View className="flex-1 items-end">
              <Text className="text-gray-400 text-xs uppercase tracking-wide mb-1">
                Orders
              </Text>
              <Text className="text-white text-2xl font-bold">
                {eventPurchases.length}
              </Text>
              <Text className="text-gray-500 text-xs">
                total purchases
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="bg-gray-700 rounded-full h-2 mb-2">
            <View 
              className="bg-[#702963] h-2 rounded-full"
              style={{ 
                width: `${Math.min((totalTicketsSold / item.ticketQuantity) * 100, 100)}%` 
              }}
            />
          </View>
          <Text className="text-gray-400 text-xs text-center">
            {((totalTicketsSold / item.ticketQuantity) * 100).toFixed(1)}% sold
          </Text>
        </View>

        {/* Purchases Section */}
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-lg">Recent Purchases</Text>
            {eventPurchases.length > 0 && (
              <View className="bg-[#702963]/20 px-2 py-1 rounded-full">
                <Text className="text-[#702963] text-xs font-medium">
                  {eventPurchases.length} orders
                </Text>
              </View>
            )}
          </View>

          {eventPurchases.length > 0 ? (
            <View className="space-y-3">
              {eventPurchases.slice(0, 3).map((purchase, index) => (
                <View key={purchase.id} className="bg-gray-800 rounded-lg p-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-medium">
                      Order #{purchase.bookingId.split('-')[1]?.toUpperCase() || 'N/A'}
                    </Text>
                    <View className="bg-green-500/20 px-2 py-1 rounded-full">
                      <Text className="text-green-400 text-xs font-medium">Confirmed</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-400 text-sm">
                        Quantity: {purchase.quantity} tickets
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    <Text className="text-[#702963] font-bold">
                      LKR {(purchase.quantity * item.ticketprice).toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}

              {eventPurchases.length > 3 && (
                <TouchableOpacity className="bg-gray-800 rounded-lg p-3 items-center border-2 border-dashed border-gray-700">
                  <Text className="text-gray-400 text-sm">
                    +{eventPurchases.length - 3} more purchases
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="bg-gray-800/30 rounded-lg p-6 items-center">
              <Ionicons name="ticket-outline" size={32} color="#6B7280" />
              <Text className="text-gray-400 text-center mt-2">
                No ticket purchases yet
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1">
                Purchases will appear here once tickets are sold
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading ticket data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Ticket Purchases</Text>
        <Ionicons name="analytics-outline" size={24} color="white" />
      </View>

      {/* Events with Purchases */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default PurchasesByEventScreen