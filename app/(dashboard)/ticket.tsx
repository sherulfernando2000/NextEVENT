import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal } from "react-native"
import React, { useEffect, useState } from "react"
import QRCode from "react-native-qrcode-svg"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { getTicketPurchasesByUser } from "@/services/ticketService"
import { useAuth } from "@/context/AuthContext"

const TicketsScreen = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const router = useRouter()
  const [purchaseTickets, setPurchaseTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { user } = useAuth();

  const fetchPurchaseTickets = async () => {
    try {
      setLoading(true);
      console.log('user', user?.uid)
      const resp = await getTicketPurchasesByUser(user ? user?.uid : "");
      setPurchaseTickets(resp)
      console.log(resp)
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPurchaseTickets()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const filterTickets = () => {
    const now = new Date();
    if (activeTab === "upcoming") {
      return purchaseTickets.filter((ticket: any) => new Date(ticket.event.date) >= now);
    } else {
      return purchaseTickets.filter((ticket: any) => new Date(ticket.event.date) < now);
    }
  };

  const handleTicketPress = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  const renderTicket = ({ item }: any) => (
    <TouchableOpacity 
      className="bg-gray-900 rounded-2xl mx-4 mb-4 p-4"
      onPress={() => handleTicketPress(item)}
    >
      {/* Header with Title and Status */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-white text-lg font-bold flex-1 mr-2" numberOfLines={2}>
          {item.event.title}
        </Text>
        <View className="bg-green-600/20 rounded-full px-3 py-1">
          <Text className="text-green-400 text-xs font-semibold">Purchased</Text>
        </View>
      </View>

      {/* Event Details */}
      <View className="space-y-2 mb-4">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 text-sm ml-2">
            {formatDate(item.event.date)} at {formatTime(item.event.date)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 text-sm ml-2" numberOfLines={1}>
            {item.event.location}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="receipt-outline" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 text-sm ml-2">
            Booking ID: {item.bookingId}
          </Text>
        </View>
      </View>

      {/* Bottom Row */}
      <View className="flex-row justify-between items-center pt-3 border-t border-gray-700">
        <View>
          <Text className="text-gray-400 text-xs">Quantity</Text>
          <Text className="text-white font-semibold">{item.quantity} Tickets</Text>
        </View>
        <View className="items-end">
          <Text className="text-gray-400 text-xs">Total Paid</Text>
          <Text className="text-[#702963] font-bold">
            LKR {(item.event.ticketprice * item.quantity).toLocaleString()}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="qr-code-outline" size={16} color="#702963" />
          <Text className="text-[#702963] text-sm ml-1 font-medium">View QR</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Loading your tickets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold flex-1 text-center">
          My Tickets
        </Text>

        <TouchableOpacity className="p-2 -mr-2">
          <Ionicons name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row mx-4 mb-6 bg-gray-900 rounded-full p-1">
        <TouchableOpacity 
          onPress={() => setActiveTab("upcoming")} 
          className={`flex-1 py-3 rounded-full ${
            activeTab === "upcoming" ? 'bg-[#702963]' : ''
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === "upcoming" ? 'text-white' : 'text-gray-400'
          }`}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveTab("past")} 
          className={`flex-1 py-3 rounded-full ${
            activeTab === "past" ? 'bg-[#702963]' : ''
          }`}
        >
          <Text className={`text-center font-semibold ${
            activeTab === "past" ? 'text-white' : 'text-gray-400'
          }`}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tickets List */}
      <FlatList
        data={filterTickets()}
        keyExtractor={(item) => item.id}
        renderItem={renderTicket}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <View className="bg-gray-900 rounded-full p-6 mb-4">
              <Ionicons 
                name={activeTab === "upcoming" ? "calendar-outline" : "time-outline"} 
                size={48} 
                color="#702963" 
              />
            </View>
            <Text className="text-white text-xl font-semibold mb-2">
              No {activeTab} tickets
            </Text>
            <Text className="text-gray-400 text-center text-base px-8">
              {activeTab === "upcoming" 
                ? "You don't have any upcoming events. Start exploring and book your next adventure!"
                : "No past events found. Your completed events will appear here."
              }
            </Text>
          </View>
        }
      />

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <View className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-lg font-bold">Your Ticket</Text>
              <TouchableOpacity 
                onPress={() => setShowQRModal(false)}
                className="p-1"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <>
                {/* Event Info */}
                <View className="items-center mb-6">
                  <Text className="text-white text-xl font-bold text-center mb-2">
                    {selectedTicket.event.title}
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    {formatDate(selectedTicket.event.date)} at {formatTime(selectedTicket.event.date)}
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    {selectedTicket.event.location}
                  </Text>
                </View>

                {/* QR Code */}
                <View className="items-center mb-6">
                  <View className="bg-white rounded-2xl p-6">
                    <QRCode 
                      value={selectedTicket.bookingId} 
                      size={200}
                      backgroundColor="white"
                      color="black"
                    />
                  </View>
                </View>

                {/* Ticket Details */}
                <View className="bg-gray-800 rounded-xl p-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400 text-sm">Booking ID</Text>
                    <Text className="text-white text-sm font-mono">
                      {selectedTicket.bookingId}
                    </Text>
                  </View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400 text-sm">Quantity</Text>
                    <Text className="text-white text-sm">
                      {selectedTicket.quantity} Tickets
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-sm">Total Paid</Text>
                    <Text className="text-[#702963] text-sm font-bold">
                      LKR {(selectedTicket.event.ticketprice * selectedTicket.quantity).toLocaleString()}
                    </Text>
                  </View>
                </View>

                {/* Instructions */}
                <View className="mt-4">
                  <Text className="text-gray-400 text-xs text-center">
                    Show this QR code at the event entrance for verification
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default TicketsScreen