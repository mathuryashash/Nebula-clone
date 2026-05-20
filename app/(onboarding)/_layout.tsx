import { Stack } from 'expo-router'
import { BG } from '@/lib/theme'

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: BG }, animation: 'fade' }}>
      <Stack.Screen name="index" />
    </Stack>
  )
}
