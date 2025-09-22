import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CameraView, Camera } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)
  const [scanning, setScanning] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    getCameraPermissions()
  }, [])

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return
    
    setScanned(true)
    setScanning(false)
    
    // Validate if the scanned data looks like a booking ID
    if (isValidBookingId(data)) {
      validateTicket(data)
    } else {
      Alert.alert(
        "Invalid QR Code",
        "This doesn't appear to be a valid ticket QR code.",
        [
          {
            text: "Scan Again",
            onPress: () => setScanned(false)
          }
        ]
      )
    }
  }

  const isValidBookingId = (data: string): boolean => {
    // Check if it matches your booking ID format (e.g., "1757957014778-h6kkbsq")
    const bookingIdPattern = /^\d{13}-[a-z0-9]{7}$/
    return bookingIdPattern.test(data)
  }

  const validateTicket = async (bookingId: string) => {
    try {
      // Here you would typically call your API to validate the ticket
      // const response = await validateTicketByBookingId(bookingId)
      
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, randomly simulate valid/invalid tickets
        const isValid = Math.random() > 0.3 // 70% chance of being valid
        
        if (isValid) {
          Alert.alert(
            "Ticket Validated ✓",
            `Booking ID: ${bookingId}\n\nTicket has been successfully validated and released.`,
            [
              {
                text: "Scan Another",
                style: "default",
                onPress: () => setScanned(false)
              },
              {
                text: "Done",
                style: "cancel",
                onPress: () => router.back()
              }
            ]
          )
        } else {
          Alert.alert(
            "Invalid Ticket ✗",
            `Booking ID: ${bookingId}\n\nThis ticket has either already been used or is not valid.`,
            [
              {
                text: "Scan Another",
                onPress: () => setScanned(false)
              }
            ]
          )
        }
      }, 1000)
      
    } catch (error) {
      Alert.alert(
        "Validation Error",
        "Unable to validate ticket. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => setScanned(false)
          }
        ]
      )
    }
  }

  const startScanning = () => {
    setScanning(true)
    setScanned(false)
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="px-4 pt-12 pb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="camera-outline" size={64} color="#6B7280" />
          <Text className="text-white text-xl font-semibold mt-4 mb-2 text-center">
            Camera Permission Required
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            Please enable camera access in your device settings to scan QR codes.
          </Text>
          <TouchableOpacity 
            className="bg-[#702963] rounded-lg px-6 py-3"
            onPress={() => Camera.requestCameraPermissionsAsync()}
          >
            <Text className="text-white font-semibold">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pt-12 pb-6 z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">QR Scanner</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* Camera or Start Button */}
      <View className="flex-1">
        {scanning ? (
          <View className="flex-1">
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            
            {/* Scanner Overlay */}
            <View className="flex-1 justify-center items-center">
              <View className="absolute inset-0 bg-black/50" />
              
              {/* Scanner Frame */}
              <View className="w-64 h-64 relative">
                <View className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
                
                {/* Corner frames */}
                <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#702963] rounded-tl-2xl" />
                <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#702963] rounded-tr-2xl" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#702963] rounded-bl-2xl" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#702963] rounded-br-2xl" />
                
                {/* Scanning line animation could go here */}
              </View>
              
              <Text className="text-white text-lg font-semibold mt-8 text-center">
                Position QR code within the frame
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center px-6">
                The ticket QR code will be scanned automatically
              </Text>
            </View>

            {/* Cancel Button */}
            <View className="absolute bottom-16 left-0 right-0 items-center">
              <TouchableOpacity
                className="bg-gray-800/80 rounded-full px-6 py-3"
                onPress={() => setScanning(false)}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Start Scanning View */
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm items-center">
              <View className="w-20 h-20 bg-[#702963]/20 rounded-full items-center justify-center mb-6">
                <Ionicons name="qr-code-outline" size={40} color="#702963" />
              </View>
              
              <Text className="text-white text-2xl font-bold mb-4 text-center">
                Scan Ticket QR Code
              </Text>
              
              <Text className="text-gray-400 text-center mb-8">
                Tap the button below to open the camera and scan a ticket QR code for validation.
              </Text>

              <TouchableOpacity
                className="bg-[#702963] rounded-lg py-4 px-8 w-full"
                onPress={startScanning}
              >
                <Text className="text-white text-lg font-semibold text-center">
                  Start Scanning
                </Text>
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View className="mt-8">
              <Text className="text-gray-500 text-sm text-center mb-2">
                Instructions:
              </Text>
              <Text className="text-gray-400 text-xs text-center">
                • Hold the device steady over the QR code
              </Text>
              <Text className="text-gray-400 text-xs text-center">
                • Ensure good lighting for best results
              </Text>
              <Text className="text-gray-400 text-xs text-center">
                • The camera will automatically detect the code
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

export default QRScanner