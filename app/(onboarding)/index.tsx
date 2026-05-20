/**
 * Onboarding: Collect birth data for chart calculation.
 * Multi-step: Name → Birth Date → Birth Time → Location
 */
import { useState, useRef } from 'react'
import {
  View, ScrollView, Pressable, StyleSheet, TextInput, Platform,
  KeyboardAvoidingView, Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, GOLD, SURFACE, SURFACE2, TEXT_SECONDARY, TEXT_TERTIARY } from '@/lib/theme'
import { saveProfile } from '@/lib/userProfile'
import { calculateBirthChart, getSunSign, getMoonSign, getRisingSign } from '@/lib/astrology'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'

const { width: SW } = Dimensions.get('window')

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TIMEZONES = [-12,-11,-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,5.5,6,6.5,7,8,9,9.5,10,11,12]

const ZODIAC_EMOJIS: Record<string, string> = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋', Leo:'♌', Virgo:'♍',
  Libra:'♎', Scorpio:'♏', Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓',
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('1995')
  const [birthMonth, setBirthMonth] = useState(6)   // 1-indexed
  const [birthDay, setBirthDay] = useState(15)
  const [birthHour, setBirthHour] = useState(12)
  const [birthMinute, setBirthMinute] = useState(0)
  const [timezone, setTimezone] = useState(0)
  const [lat, setLat] = useState('40.7128')
  const [lng, setLng] = useState('-74.0060')
  const [city, setCity] = useState('New York, NY')

  const steps = [
    { title: "What's your name?", subtitle: "We'll personalize your readings", emoji: '✨' },
    { title: "When were you born?", subtitle: "Your birth date reveals your Sun sign", emoji: '☉' },
    { title: "What time were you born?", subtitle: "Birth time determines your Rising sign", emoji: '⏰' },
    { title: "Where were you born?", subtitle: "Your birthplace completes your natal chart", emoji: '🌍' },
  ]

  const current = steps[step]
  const progress = (step + 1) / steps.length

  function canProceed() {
    if (step === 0) return name.trim().length >= 2
    if (step === 1) {
      const y = parseInt(birthYear)
      return y >= 1900 && y <= 2025 && birthDay >= 1 && birthDay <= 31
    }
    if (step === 2) return true
    if (step === 3) return city.trim().length >= 2
    return true
  }

  async function handleFinish() {
    setLoading(true)
    setError('')
    try {
      const year = parseInt(birthYear)
      const birthData = {
        year, month: birthMonth, day: birthDay,
        hour: birthHour, minute: birthMinute,
        lat: parseFloat(lat) || 40.7128,
        lng: parseFloat(lng) || -74.006,
        timezone,
      }
      const sunSign   = getSunSign(birthMonth, birthDay)
      const moonSign  = getMoonSign(year, birthMonth, birthDay, birthHour)
      const risingSign = getRisingSign(year, birthMonth, birthDay, birthHour, birthMinute, parseFloat(lat)||40.7128, parseFloat(lng)||-74.006, timezone)

      await saveProfile({
        name: name.trim(),
        birthData,
        sunSign, moonSign, risingSign,
        savedAt: new Date().toISOString(),
      })

      if (isSupabaseEnabled) {
        await supabase.auth.updateUser({ data: { onboarding_completed: true, sun_sign: sunSign } })
      }

      router.replace('/(tabs)')
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: BG }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        pointerEvents="none"
        colors={['#0d0622','#080612','#080612']}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Progress bar */}
      <View style={[s.progressContainer, { paddingTop: insets.top + 16 }]}>
        <View style={s.progressTrack}>
          <LinearGradient colors={['#a855f7','#7c3aed']} start={{x:0,y:0}} end={{x:1,y:0}} style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={s.stepLabel}>{step + 1} / {steps.length}</Text>
      </View>

      <ScrollView contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={s.header}>
          <Text style={s.emoji}>{current.emoji}</Text>
          <Text style={s.title}>{current.title}</Text>
          <Text style={s.subtitle}>{current.subtitle}</Text>
        </View>

        {/* Step content */}
        {step === 0 && (
          <View style={s.inputSection}>
            <TextInput
              style={s.textInput}
              placeholder="Your first name"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={name}
              onChangeText={setName}
              autoFocus
              returnKeyType="next"
              autoCapitalize="words"
            />
          </View>
        )}

        {step === 1 && (
          <View style={s.inputSection}>
            <Text style={s.fieldLabel}>Year</Text>
            <TextInput
              style={s.textInput}
              placeholder="1995"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={birthYear}
              onChangeText={setBirthYear}
              keyboardType="numeric"
              maxLength={4}
            />
            <Text style={[s.fieldLabel, { marginTop: 20 }]}>Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              <View style={{ flexDirection:'row', gap: 8, paddingHorizontal: 4 }}>
                {MONTHS.map((m, i) => (
                  <Pressable key={m} onPress={() => setBirthMonth(i+1)} style={[s.chip, birthMonth === i+1 && s.chipActive]}>
                    <Text style={[s.chipText, birthMonth === i+1 && s.chipTextActive]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Text style={[s.fieldLabel, { marginTop: 20 }]}>Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
              <View style={{ flexDirection:'row', gap: 6, paddingHorizontal: 4 }}>
                {Array.from({ length: 31 }, (_, i) => i+1).map(d => (
                  <Pressable key={d} onPress={() => setBirthDay(d)} style={[s.dayChip, birthDay === d && s.chipActive]}>
                    <Text style={[s.chipText, birthDay === d && s.chipTextActive]}>{d}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            {birthYear.length === 4 && parseInt(birthYear) >= 1900 && (
              <View style={s.signPreview}>
                <Text style={s.signPreviewLabel}>Your Sun Sign</Text>
                <Text style={s.signPreviewSign}>
                  {ZODIAC_EMOJIS[getSunSign(birthMonth, birthDay)]} {getSunSign(birthMonth, birthDay)}
                </Text>
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={s.inputSection}>
            <Text style={s.fieldLabel}>Hour (24h)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection:'row', gap: 8 }}>
                {Array.from({ length: 24 }, (_, i) => i).map(h => (
                  <Pressable key={h} onPress={() => setBirthHour(h)} style={[s.dayChip, birthHour === h && s.chipActive]}>
                    <Text style={[s.chipText, birthHour === h && s.chipTextActive]}>{h.toString().padStart(2,'0')}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Text style={[s.fieldLabel, { marginTop: 20 }]}>Minute</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection:'row', gap: 8 }}>
                {[0,5,10,15,20,25,30,35,40,45,50,55].map(m => (
                  <Pressable key={m} onPress={() => setBirthMinute(m)} style={[s.dayChip, birthMinute === m && s.chipActive]}>
                    <Text style={[s.chipText, birthMinute === m && s.chipTextActive]}>{m.toString().padStart(2,'0')}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Text style={[s.fieldLabel, { marginTop: 20 }]}>Timezone (UTC offset)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection:'row', gap: 6 }}>
                {TIMEZONES.map(tz => (
                  <Pressable key={tz} onPress={() => setTimezone(tz)} style={[s.chip, timezone === tz && s.chipActive]}>
                    <Text style={[s.chipText, timezone === tz && s.chipTextActive]}>UTC{tz >= 0 ? '+' : ''}{tz}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Text style={s.timeNote}>⚠️ Birth time determines your Rising sign. If unknown, leave at noon.</Text>
          </View>
        )}

        {step === 3 && (
          <View style={s.inputSection}>
            <Text style={s.fieldLabel}>City of Birth</Text>
            <TextInput
              style={s.textInput}
              placeholder="New York, NY"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={city}
              onChangeText={setCity}
              autoFocus
            />
            <Text style={[s.fieldLabel, { marginTop: 20 }]}>Latitude</Text>
            <TextInput
              style={s.textInput}
              placeholder="40.7128"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={lat}
              onChangeText={setLat}
              keyboardType="numeric"
            />
            <Text style={[s.fieldLabel, { marginTop: 16 }]}>Longitude</Text>
            <TextInput
              style={s.textInput}
              placeholder="-74.0060"
              placeholderTextColor="rgba(255,255,255,0.25)"
              value={lng}
              onChangeText={setLng}
              keyboardType="numeric"
            />
            <Text style={s.timeNote}>💡 Tip: Search your city name to find its coordinates online.</Text>
          </View>
        )}

        {error ? <Text style={s.errorText}>{error}</Text> : null}

        {/* Navigation buttons */}
        <View style={s.navRow}>
          {step > 0 && (
            <Pressable onPress={() => setStep(s2 => s2 - 1)} style={s.backBtn}>
              <Text style={s.backText}>← Back</Text>
            </Pressable>
          )}
          <Pressable
            onPress={step < 3 ? () => setStep(s2 => s2 + 1) : handleFinish}
            disabled={!canProceed() || loading}
            style={[s.nextBtn, (!canProceed() || loading) && { opacity: 0.5 }]}
          >
            <LinearGradient colors={['#a855f7','#7c3aed']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.nextGrad}>
              <Text style={s.nextText}>{loading ? '✨ Building your chart...' : step < 3 ? 'Continue →' : 'See My Chart ✦'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  progressContainer: { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:20 },
  progressTrack: { flex:1, height:4, backgroundColor:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:2 },
  stepLabel: { color:'rgba(255,255,255,0.35)', fontSize:12, fontWeight:'600' },
  scroll: { paddingHorizontal:24 },
  header: { paddingTop:40, paddingBottom:32, gap:8 },
  emoji: { fontSize:44, marginBottom:4 },
  title: { color:'#fff', fontSize:28, fontWeight:'800', letterSpacing:-0.5 },
  subtitle: { color:'rgba(255,255,255,0.45)', fontSize:15, lineHeight:22 },
  inputSection: { gap:12 },
  fieldLabel: { color:'rgba(255,255,255,0.55)', fontSize:13, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8 },
  textInput: {
    backgroundColor: SURFACE,
    borderWidth:1, borderColor: BORDER,
    borderRadius:14, paddingHorizontal:18, paddingVertical:16,
    color:'#fff', fontSize:16, fontWeight:'500',
  },
  chip: {
    paddingHorizontal:14, paddingVertical:9,
    borderRadius:999, borderWidth:1, borderColor: BORDER,
    backgroundColor:'rgba(255,255,255,0.04)',
  },
  chipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BORDER },
  dayChip: {
    width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor: BORDER, backgroundColor:'rgba(255,255,255,0.04)',
  },
  chipText: { color:'rgba(255,255,255,0.55)', fontSize:13, fontWeight:'600' },
  chipTextActive: { color: ACCENT, fontWeight:'700' },
  signPreview: { marginTop:20, backgroundColor: ACCENT_DIM, borderWidth:1, borderColor: ACCENT_BORDER, borderRadius:16, padding:20, alignItems:'center', gap:8 },
  signPreviewLabel: { color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:'600', textTransform:'uppercase', letterSpacing:1 },
  signPreviewSign: { color:'#fff', fontSize:22, fontWeight:'800' },
  timeNote: { color:'rgba(255,255,255,0.35)', fontSize:12.5, lineHeight:18, marginTop:8 },
  errorText: { color:'#f87171', fontSize:13, textAlign:'center', marginTop:8 },
  navRow: { flexDirection:'row', gap:12, marginTop:40, alignItems:'center' },
  backBtn: { paddingHorizontal:20, paddingVertical:16 },
  backText: { color:'rgba(255,255,255,0.4)', fontSize:15, fontWeight:'600' },
  nextBtn: { flex:1, borderRadius:999, overflow:'hidden' },
  nextGrad: { paddingVertical:17, alignItems:'center' },
  nextText: { color:'#fff', fontSize:16, fontWeight:'800', letterSpacing:0.2 },
})
