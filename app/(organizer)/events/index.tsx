import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { deleteEvent, getEventsByUser } from "@/services/eventService";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/types";
import moment from "moment";
import { Alert, ActivityIndicator } from "react-native";

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   location: string;
// }

const EventIndex = () => {
  const router = useRouter();
  const { user } = useAuth()
  const navigation = useNavigation()
  // const [events, setEvents] = useState<Event[]>([
  //   { id: "1", title: "Music Fest", date: "2025-09-20", location: "Colombo" },
  //   { id: "2", title: "Tech Meetup", date: "2025-10-01", location: "Kandy" },
  // ]);

  const [events, setEvents] = useState<Event[]>()
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEventsByUser = async () => {
    // console.log(user.uid)
    const events = await getEventsByUser(user ? user?.uid : "")
    console.log('events:', events)
    setEvents(events)
  }


  useEffect(() => {
    fetchEventsByUser()
  }, [])

  // Delete handler
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleteLoading(true)
              await deleteEvent(id);
              fetchEventsByUser();
              Alert.alert("Success", "Event deleted successfully ✅");
            } catch (error) {
              Alert.alert("Error", "Failed to delete event ❌");
            } finally {
              setDeleteLoading(false)
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity onPress={() => router.push(`/(organizer)/events/${item.id}`)}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{moment(item.startingTime).format('MMMM Do YYYY')}</Text>
          <Text style={styles.subtitle}>{item.location}</Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

    </TouchableOpacity>

  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-2 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">My Events</Text>
        <Ionicons name="analytics-outline" size={24} color="white" />
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(organizer)/events/add")}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {deleteLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: "white", marginTop: 10 }}>Deleting...</Text>
        </View>
      )}
    </View>
  );
};

export default EventIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    color: "#B0B0B0",
  },
  deleteBtn: {
    backgroundColor: "#a13539",
    padding: 10,
    borderRadius: 8,
    opacity: 0.8
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.purple,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});


