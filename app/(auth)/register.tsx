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
import { register } from "@/services/authService"
import { Events } from "@/constants/dummy"

const Register = () => {
  const router = useRouter()
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // Validation states
  const [fullNameError, setFullNameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")

  // Full name validation
  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError("Full name is required")
      return false
    }
    if (name.length < 2) {
      setFullNameError("Name must be at least 2 characters")
      return false
    }
    setFullNameError("")
    return true
  }

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

  // Confirm password validation
  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError("Please confirm your password")
      return false
    }
    if (confirmPass !== password) {
      setConfirmPasswordError("Passwords do not match")
      return false
    }
    setConfirmPasswordError("")
    return true
  }

  const handleFullNameChange = (text: string) => {
    setFullName(text)
    if (fullNameError) validateFullName(text)
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (emailError) validateEmail(text)
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    if (passwordError) validatePassword(text)
    // Revalidate confirm password if it exists
    if (confirmPassword) validateConfirmPassword(confirmPassword)
  }

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text)
    if (confirmPasswordError) validateConfirmPassword(text)
  }

  const handleRegister = async () => {
    const isFullNameValid = validateFullName(fullName)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword)

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await register(email, password)
      console.log(res)
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.back() }
      ])
    } catch (err) {
      console.error(err)
      Alert.alert("Registration Failed", "Something went wrong. Please try again.")
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
            <View className="items-center mb-10">
              <Image
                source={Events[0].image}
                style={{
                  width: 50,
                  height: 50
                }}
                resizeMode="cover"
              />
              <Text className="text-3xl font-bold text-white mb-2">NextEVENT</Text>
              <Text className="w-full text-center text-gray-400 text-base">Create your account to get started</Text>
            </View>

            {/* Form Section */}
            <View className="space-y-6">

              {/* Full Name Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-medium mb-2">Full Name</Text>
                <View className={`border-2 ${fullNameError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <TextInput
                    placeholder="Enter your full name"
                    className="flex-1 ml-3 text-white text-base"
                    placeholderTextColor="#6B7280"
                    value={fullName}
                    onChangeText={handleFullNameChange}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
                {fullNameError ? (
                  <Text className="text-red-400 text-sm mt-1">{fullNameError}</Text>
                ) : null}
              </View>

              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-medium mb-2">Email</Text>
                <View className={`border-2 ${emailError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
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
              <View className="mb-5">
                <Text className="text-white text-sm font-medium mb-2">Password</Text>
                <View className={`border-2 ${passwordError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
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

              {/* Confirm Password Input */}
              <View className="mb-5">
                <Text className="text-white text-sm font-medium mb-2">Confirm Password</Text>
                <View className={`border-2 ${confirmPasswordError ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-1 flex-row items-center`}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
                  <TextInput
                    placeholder="Confirm your password"
                    className="flex-1 ml-3 text-white text-base"
                    placeholderTextColor="#6B7280"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text className="text-red-400 text-sm mt-1">{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Terms and Conditions */}
              <View className="flex-row items-start mb-4">
                <Text className="text-gray-400 text-sm leading-5">
                  By creating an account, you agree to our{" "}
                  <Text className="text-blue-400">Terms of Service</Text>
                  {" "}and{" "}
                  <Text className="text-blue-400">Privacy Policy</Text>
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`bg-[#702963] rounded-xl py-4 mt-2 ${isLoading ? 'opacity-70' : ''}`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-center text-white text-lg font-semibold">
                    Create Account
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
                <TouchableOpacity className="bg-gray-700 border border-gray-700 rounded-xl py-4 flex-row items-center justify-center">
                  <Ionicons name="logo-google" size={20} color="#fff" />
                  <Text className="text-white text-base font-medium ml-3">Continue with Google</Text>
                </TouchableOpacity>
              </View>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-6">
                <Text className="w-2/3 text-gray-400 text-base">Already have an account? </Text>
                <Pressable onPress={() => router.back()}>
                  <Text className="text-blue-400 text-base font-semibold">Sign In</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

export default Register