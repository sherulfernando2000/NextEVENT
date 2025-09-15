import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust import path as needed

const SettingScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Handle logout logic here
            console.log("User logged out");
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            // Handle account deletion logic here
            console.log("Account deletion requested");
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      section: "Account",
      items: [
        {
          icon: "person-outline",
          title: "Edit Profile",
          subtitle: "Update your personal information",
          onPress: () => router.push("/profile/edit"),
          showArrow: true
        },
        {
          icon: "key-outline",
          title: "Change Password",
          subtitle: "Update your password",
          onPress: () => router.push("/auth/change-password"),
          showArrow: true
        },
        {
          icon: "card-outline",
          title: "Payment Methods",
          subtitle: "Manage your payment options",
          onPress: () => router.push("/profile/payment-methods"),
          showArrow: true
        }
      ]
    },
    {
      section: "Preferences",
      items: [
        {
          icon: "notifications-outline",
          title: "Notifications",
          subtitle: "Event updates and reminders",
          isToggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled
        },
        {
          icon: "location-outline",
          title: "Location Services",
          subtitle: "Find events near you",
          isToggle: true,
          value: locationEnabled,
          onToggle: setLocationEnabled
        },
        {
          icon: "moon-outline",
          title: "Dark Mode",
          subtitle: "Use dark theme",
          isToggle: true,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled
        }
      ]
    },
    {
      section: "Support",
      items: [
        {
          icon: "help-circle-outline",
          title: "Help Center",
          subtitle: "Get support and find answers",
          onPress: () => router.push("/support/help"),
          showArrow: true
        },
        {
          icon: "chatbubble-outline",
          title: "Contact Us",
          subtitle: "Send us your feedback",
          onPress: () => router.push("/support/contact"),
          showArrow: true
        },
        {
          icon: "star-outline",
          title: "Rate App",
          subtitle: "Help us improve",
          onPress: () => console.log("Rate app"),
          showArrow: true
        }
      ]
    },
    {
      section: "Legal",
      items: [
        {
          icon: "document-text-outline",
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          onPress: () => router.push("/legal/privacy"),
          showArrow: true
        },
        {
          icon: "shield-outline",
          title: "Terms of Service",
          subtitle: "App usage terms",
          onPress: () => router.push("/legal/terms"),
          showArrow: true
        }
      ]
    }
  ];

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-6">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold flex-1 text-center">
          Settings
        </Text>

        <View className="w-8" />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View className="mx-4 mb-6">
          <View className="bg-gray-900 rounded-2xl p-6">
            <View className="flex-row items-center">
              {/* User Avatar */}
              <View className="w-16 h-16 bg-[#702963] rounded-full items-center justify-center mr-4">
                <Text className="text-white text-xl font-bold">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              
              {/* User Info */}
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">
                  {user?.displayName || 'User'}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {user?.email || 'No email available'}
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {user?.emailVerified ? 'Verified Account' : 'Unverified Account'}
                </Text>
              </View>

              {/* Edit Button */}
              <TouchableOpacity 
                className="bg-[#702963] rounded-full p-2"
                onPress={() => router.push("/profile/edit")}
              >
                <Ionicons name="pencil" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Stats */}
            <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-700">
              <View className="items-center">
                <Text className="text-[#702963] text-lg font-bold">12</Text>
                <Text className="text-gray-400 text-xs">Events Attended</Text>
              </View>
              <View className="items-center">
                <Text className="text-[#702963] text-lg font-bold">5</Text>
                <Text className="text-gray-400 text-xs">Events Created</Text>
              </View>
              <View className="items-center">
                <Text className="text-[#702963] text-lg font-bold">8</Text>
                <Text className="text-gray-400 text-xs">Saved Events</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsOptions.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mx-4 mb-6">
            <Text className="text-gray-400 text-sm font-medium mb-3 px-2">
              {section.section.toUpperCase()}
            </Text>
            
            <View className="bg-gray-900 rounded-2xl">
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity
                    className="flex-row items-center p-4"
                    onPress={item.onPress}
                    disabled={item.isToggle}
                  >
                    <View className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center mr-3">
                      <Ionicons name={item.icon as any} size={20} color="#702963" />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-white text-base font-medium">
                        {item.title}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {item.subtitle}
                      </Text>
                    </View>

                    {item.isToggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#374151', true: '#702963' }}
                        thumbColor={item.value ? '#ffffff' : '#9CA3AF'}
                      />
                    ) : item.showArrow ? (
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    ) : null}
                  </TouchableOpacity>
                  
                  {itemIndex < section.items.length - 1 && (
                    <View className="h-px bg-gray-800 ml-16" />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View className="mx-4 mb-8">
          <Text className="text-red-400 text-sm font-medium mb-3 px-2">
            DANGER ZONE
          </Text>
          
          <View className="bg-gray-900 rounded-2xl">
            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={handleLogout}
            >
              <View className="w-10 h-10 bg-orange-600/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="log-out-outline" size={20} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-orange-500 text-base font-medium">
                  Logout
                </Text>
                <Text className="text-gray-400 text-sm">
                  Sign out of your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            <View className="h-px bg-gray-800 ml-16" />

            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={handleDeleteAccount}
            >
              <View className="w-10 h-10 bg-red-600/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-red-500 text-base font-medium">
                  Delete Account
                </Text>
                <Text className="text-gray-400 text-sm">
                  Permanently delete your account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View className="mx-4 mb-8">
          <Text className="text-gray-500 text-center text-sm">
            NextEvent v1.0.0
          </Text>
          <Text className="text-gray-600 text-center text-xs mt-1">
            Built with ❤️ in Sri Lanka
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingScreen;