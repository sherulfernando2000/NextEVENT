import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const tabs = [
  { label: "Home", name: "home", icon: "home-outline" },
  { label: "Events", name: "events", icon: "list-outline" },
  { label: "Ticket", name: "tickets", icon: "ticket-outline" },

] as const

export default function OrganizerLayout() {
  return (
    // <Tabs>
    //   <Tabs.Screen name="home" options={{ title: "Dashboard" }} />
    //   <Tabs.Screen name="events" options={{ title: "My Events" }} />
    //   <Tabs.Screen name="tickets" options={{ title: "Tickets" }} />
    // </Tabs>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.purple,
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


  );
}
