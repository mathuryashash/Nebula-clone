/**
 * User profile storage using AsyncStorage.
 * Stores birth data, sign info, and preferences locally.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { BirthData, ZodiacSign } from './astrology'

const KEY = 'nebula_user_profile'

export interface UserProfile {
  name?: string
  birthData: BirthData
  sunSign: ZodiacSign
  moonSign: ZodiacSign
  risingSign: ZodiacSign
  savedAt: string
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(profile))
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEY)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEY)
}
