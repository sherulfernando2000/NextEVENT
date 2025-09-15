import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

const AboutScreen = () => {
  const router = useRouter();
  
  const features = [
    {
      icon: "calendar-outline",
      title: "Event Discovery",
      description: "Find amazing events happening across Sri Lanka"
    },
    {
      icon: "ticket-outline",
      title: "Easy Booking",
      description: "Book tickets instantly with secure payment options"
    },
    {
      icon: "create-outline",
      title: "Event Creation",
      description: "Organizers can create and promote events effortlessly"
    },
    {
      icon: "leaf-outline",
      title: "Eco-Friendly",
      description: "Go paperless with digital tickets and e-banners"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Events Created" },
    { number: "50+", label: "Cities Covered" },
    { number: "98%", label: "User Satisfaction" }
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
          About NextEvent
        </Text>

        <View className="w-8" />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="px-6 pb-8">
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-[#702963] rounded-full items-center justify-center mb-4">
              <Ionicons name="calendar" size={40} color="white" />
            </View>
            <Text className="text-white text-3xl font-bold mb-2">NextEvent</Text>
            <Text className="text-[#702963] text-lg font-semibold">Sri Lanka's Premier Event Platform</Text>
          </View>

          <Text className="text-gray-300 text-base leading-6 text-center">
            Transforming how Sri Lankans discover, create, and experience events. 
            Say goodbye to physical banners and hello to the digital future of event promotion.
          </Text>
        </View>

        {/* Mission Statement */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={['#702963', '#8B3A7C']}
            className="rounded-2xl p-6"
          >
            <View className="flex-row items-center mb-4">
              <Ionicons name="rocket-outline" size={24} color="white" />
              <Text className="text-white text-xl font-bold ml-3">Our Mission</Text>
            </View>
            <Text className="text-white/90 text-base leading-6">
              To revolutionize Sri Lanka's event industry by providing a sustainable, 
              user-friendly platform that connects event organizers with their audience 
              while promoting eco-friendly practices through digital innovation.
            </Text>
          </LinearGradient>
        </View>

        {/* Statistics */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-4">Our Impact</Text>
          <View className="flex-row flex-wrap justify-between">
            {stats.map((stat, index) => (
              <View key={index} className="bg-gray-900 rounded-xl p-4 w-[48%] mb-4">
                <Text className="text-[#702963] text-2xl font-bold text-center">
                  {stat.number}
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-1">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Features */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-4">What We Offer</Text>
          {features.map((feature, index) => (
            <View key={index} className="bg-gray-900 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <View className="w-12 h-12 bg-[#702963] rounded-full items-center justify-center mr-3">
                  <Ionicons name={feature.icon as any} size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold">
                    {feature.title}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {feature.description}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Why Choose Us */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-4">Why NextEvent?</Text>
          <View className="bg-gray-900 rounded-2xl p-6">
            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#702963" />
                <Text className="text-white font-semibold ml-2">100% Sri Lankan</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7">
                Built by Sri Lankans, for Sri Lankans, understanding our unique culture and needs.
              </Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#702963" />
                <Text className="text-white font-semibold ml-2">Eco-Friendly Solution</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7">
                Eliminate paper waste with digital tickets and electronic event promotion.
              </Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#702963" />
                <Text className="text-white font-semibold ml-2">Secure & Reliable</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7">
                Advanced security measures to protect your data and ensure smooth transactions.
              </Text>
            </View>

            <View>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#702963" />
                <Text className="text-white font-semibold ml-2">24/7 Support</Text>
              </View>
              <Text className="text-gray-400 text-sm ml-7">
                Dedicated customer support team ready to help you anytime, anywhere.
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View className="px-6 mb-8">
          <Text className="text-white text-xl font-bold mb-4">Get In Touch</Text>
          <View className="bg-gray-900 rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="mail-outline" size={20} color="#702963" />
              <Text className="text-white ml-3">support@nextevent.lk</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="call-outline" size={20} color="#702963" />
              <Text className="text-white ml-3">+94 11 234 5678</Text>
            </View>
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={20} color="#702963" />
              <Text className="text-white ml-3">Colombo, Sri Lanka</Text>
            </View>
            
            <View className="flex-row justify-center mt-4 space-x-4">
              <TouchableOpacity className="bg-[#702963] rounded-full p-3">
                <Ionicons name="logo-facebook" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#702963] rounded-full p-3 ml-4">
                <Ionicons name="logo-instagram" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-[#702963] rounded-full p-3 ml-4">
                <Ionicons name="logo-twitter" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <View className="border-t border-gray-800 pt-6">
            <Text className="text-gray-500 text-center text-sm">
              © 2024 NextEvent. All rights reserved.
            </Text>
            <Text className="text-gray-500 text-center text-sm mt-2">
              Version 1.0.0 • Made with ❤️ in Sri Lanka
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AboutScreen