import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { login } from "@/services/authService"
import { Events } from "@/constants/dummy"


const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // Validation states
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email")
      return false
    }
    setEmailError("")
    return true
  }

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (emailError) validateEmail(text)
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (passwordError) validatePassword(text)
  }

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await login(email, password)
      console.log(res)
      router.push("/home")
    } catch (err) {
      console.error(err)
      Alert.alert("Login Failed", "Invalid credentials or something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={['#000000', '#000000', '#000000']}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-8">

            {/* Logo Section */}
            <View className="items-center mb-12">

              <Image
                source={Events[0].image}
                style={{
                  width: 80,
                  height: 80
                }}
                resizeMode="cover"
              />

              <Text className="text-3xl font-bold text-white mb-2">NextEVENT</Text>
              <Text className="w-full text-center text-gray-400 text-base">Welcome back, book your Next Event</Text>
            </View>

            {/* Form Section */}
            <View className="space-y-6">

              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-medium mb-2">Email</Text>
                <View className={` border-2 ${emailError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
                  <Ionicons name="mail-outline" size={20} color="#6B7280" />
                  <TextInput
                    placeholder="Enter your email"
                    className="flex-1 ml-3 text-white text-base"
                    placeholderTextColor="#6B7280"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {emailError ? (
                  <Text className="text-red-400 text-sm mt-1">{emailError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-white text-sm font-medium mb-2">Password</Text>
                <View className={` border-2 ${passwordError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    placeholder="Enter your password"
                    className="flex-1 ml-3 text-white text-base"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={handlePasswordChange}
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text className="text-red-400 text-sm mt-1">{passwordError}</Text>
                ) : null}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity className="self-end">
                <Text className="text-blue-400 text-sm font-medium">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-[#702963] rounded-xl py-4 mt-6 ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-center text-white text-lg font-semibold">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-700" />
                <Text className="mx-4 text-gray-400 text-sm">OR</Text>
                <View className="flex-1 h-px bg-gray-700" />
              </View>

              {/* Social Login Buttons */}
              <View className="space-y-3">
                <TouchableOpacity className="bg-gray-800 border border-gray-700 rounded-xl py-4 flex-row items-center justify-center">
                  <Ionicons name="logo-google" size={20} color="#fff" />
                  <Text className="text-white text-base font-medium ml-3">Continue with Google</Text>
                </TouchableOpacity>

                
              </View>

              {/* Register Link */}
              <View className="flex-row items-center justify-center mt-8">
                <Text className="text-gray-400 text-base">Don't have an account? </Text>
                <Pressable onPress={() => router.push("/register")}>
                  <Text className="text-blue-400 text-base font-semibold">Sign Up</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default Login