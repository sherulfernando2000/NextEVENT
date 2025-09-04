import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native"
import React, { useEffect } from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import "./../global.css"

const Index = () => {
  const router = useRouter()
  const { user, loading } = useAuth()
  console.log("User data : ", user)

  useEffect(() => {
    if (!loading) {
      if (user) router.replace("/home")
      else router.replace("/login")
    }
  }, [user, loading])

  if (loading) {
    return (
       <View className="flex-1 justify-center items-center bg-black">
         <ActivityIndicator size="large" color="white" /> 
      </View>
    )
  }

  return <View className="flex-1 bg-black" />

}

export default Index
