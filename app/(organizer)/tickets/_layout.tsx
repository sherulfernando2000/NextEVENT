import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import index from '.'

const _layout = () => {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen key={1} name="index" options={{ headerShown: false }} />
      <Stack.Screen key={2} name="add" options={{ headerShown: false }} />
      <Stack.Screen key={3} name="[id]" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout