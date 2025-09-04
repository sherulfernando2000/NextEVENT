import React from "react"
import "./../global.css"
import { Slot, Stack } from "expo-router"
import { AuthProvider } from "@/context/AuthContext"
import { LoaderProvider } from "@/context/LoaderContext"
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from "react-native"

const RootLayout = () => {
  return (
    <LoaderProvider>
      <AuthProvider>
        <SafeAreaView className="flex-1 bg-black ">
          <Slot></Slot>
        </SafeAreaView>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout
