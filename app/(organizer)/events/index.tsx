import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
}

const index = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "Music Fest", date: "2025-09-20", location: "Colombo" },
    { id: "2", title: "Tech Meetup", date: "2025-10-01", location: "Kandy" },
  ]);

  // Delete handler
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity onPress={() => router.push(`/(organizer)/events/${item.id}`)}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.date}</Text>
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
      <Text style={styles.header}>My Events</Text>

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
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  deleteBtn: {
    backgroundColor: "#a13539",
    padding: 10,
    borderRadius: 8,
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
});
