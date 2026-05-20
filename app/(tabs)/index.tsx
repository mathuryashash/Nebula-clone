/**
 * Today tab — Personalized horoscope feed
 * Daily / Weekly / Monthly with sign-specific content
 */
import { useState, useEffect } from 'react'
import { View, ScrollView, Pressable, StyleSheet, Dimensions, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import {
  ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, GOLD, GOLD_DIM, SURFACE, SURFACE2,
  TEXT_SECONDARY, TEXT_TERTIARY, FIRE_COLOR, EARTH_COLOR, AIR_COLOR, WATER_COLOR,
} from '@/lib/theme'
import { loadProfile, UserProfile } from '@/lib/userProfile'
import { SIGN_META, getMoonPhase, ZodiacSign } from '@/lib/astrology'
import { getReading, HoroscopePeriod } from '@/lib/horoscopeContent'

const { width: SW } = Dimensions.get('window')

const PERIODS: { key: HoroscopePeriod; label: string }[] = [
  { key: 'daily',   label: 'Today'  },
  { key: 'weekly',  label: 'Week'   },
  { key: 'monthly', label: 'Month'  },
]

const ELEMENT_COLORS: Record<string, string> = {
  Fire: FIRE_COLOR, Earth: EARTH_COLOR, Air: AIR_COLOR, Water: WATER_COLOR,
}

function PeriodPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.pill, active && s.pillActive, pressed && { opacity: 0.8 }]}>
      {active && (
        <LinearGradient colors={['#a855f7','#7c3aed']} start={{x:0,y:0}} end={{x:1,y:0}} style={StyleSheet.absoluteFillObject} borderRadius={999} />
      )}
      <Text style={[s.pillText, active && s.pillTextActive]}>{label}</Text>
    </Pressable>
  )
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={s.scoreRow}>
      <Text style={s.scoreLabel}>{label}</Text>
      <View style={s.scoreTrack}>
        <View style={[s.scoreFill, { width: `${value}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={s.scoreValue}>{value}%</Text>
    </View>
  )
}

export default function TodayScreen() {
  const insets = useSafeAreaInsets()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [period, setPeriod] = useState<HoroscopePeriod>('daily')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { fetchProfile() }, [])

  async function fetchProfile() {
    const p = await loadProfile()
    setProfile(p)
  }

  async function onRefresh() {
    setRefreshing(true)
    await fetchProfile()
    setRefreshing(false)
  }

  const now = new Date()
  const moonPhase = getMoonPhase(now)
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })

  const sign: ZodiacSign = profile?.sunSign ?? 'Aries'
  const meta = SIGN_META[sign]
  const reading = getReading(sign, period)
  const elemColor = ELEMENT_COLORS[meta.element]

  const dayOfWeek = now.getDay()
  const planetaryDay = ['Sun ☉','Moon ☽','Mars ♂','Mercury ☿','Jupiter ♃','Venus ♀','Saturn ♄'][dayOfWeek]

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ACCENT} />}
      >
        {/* Header */}
        <LinearGradient
          colors={['#160d2e','#0a0618','rgba(8,6,18,0)']}
          style={[s.headerGrad, { paddingTop: insets.top + 16 }]}
        >
          <View style={s.header}>
            <View>
              <Text style={s.greeting}>Good {getGreeting()}, {profile?.name ?? 'Stargazer'} 🌙</Text>
              <Text style={s.date}>{dateStr}</Text>
            </View>
            <View style={s.moonBadge}>
              <Text style={s.moonEmoji}>{moonPhase.emoji}</Text>
              <Text style={s.moonText}>{moonPhase.illumination}%</Text>
            </View>
          </View>

          {/* Planetary day strip */}
          <View style={s.planetaryDay}>
            <Text style={s.planetaryDayText}>Planetary Day: {planetaryDay}</Text>
            <Text style={s.moonPhaseName}>{moonPhase.name}</Text>
          </View>
        </LinearGradient>

        {/* Sign card */}
        <View style={s.section}>
          <View style={[s.signCard, { borderColor: elemColor + '40' }]}>
            <LinearGradient
              colors={[elemColor + '18', 'transparent']}
              start={{x:0,y:0}} end={{x:1,y:1}}
              style={StyleSheet.absoluteFillObject}
              borderRadius={20}
            />
            <View style={s.signRow}>
              <View style={[s.signIconBg, { backgroundColor: elemColor + '22' }]}>
                <Text style={s.signGlyph}>{meta.symbol}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={s.signName}>{sign}</Text>
                <Text style={[s.signMeta, { color: elemColor }]}>{meta.element} · {meta.modality} · Ruled by {meta.ruling}</Text>
                <Text style={s.signDates}>{meta.dates}</Text>
              </View>
            </View>
            {profile && (
              <View style={s.trinityRow}>
                <View style={s.trinityItem}>
                  <Text style={s.trinityLabel}>☉ Sun</Text>
                  <Text style={s.trinityValue}>{profile.sunSign}</Text>
                </View>
                <View style={s.trinitySep} />
                <View style={s.trinityItem}>
                  <Text style={s.trinityLabel}>☽ Moon</Text>
                  <Text style={s.trinityValue}>{profile.moonSign}</Text>
                </View>
                <View style={s.trinitySep} />
                <View style={s.trinityItem}>
                  <Text style={s.trinityLabel}>↑ Rising</Text>
                  <Text style={s.trinityValue}>{profile.risingSign}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Period selector */}
        <View style={s.pillRow}>
          {PERIODS.map(p => (
            <PeriodPill key={p.key} label={p.label} active={period === p.key} onPress={() => setPeriod(p.key)} />
          ))}
        </View>

        {/* Horoscope reading */}
        <View style={s.section}>
          {/* Overview */}
          <View style={s.readingCard}>
            <LinearGradient
              colors={['rgba(168,85,247,0.06)','transparent']}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
            />
            <Text style={s.overviewText}>{reading.overview}</Text>
          </View>

          {/* Category cards */}
          {[
            { icon:'♡', label:'Love & Relationships', text: reading.love },
            { icon:'⬡', label:'Career & Finance',     text: reading.career },
            { icon:'✧', label:'Mind & Wellness',       text: reading.wellness },
          ].map((c, i) => (
            <View key={i} style={s.categoryCard}>
              <View style={s.catHeader}>
                <View style={s.catIconBg}>
                  <Text style={s.catIcon}>{c.icon}</Text>
                </View>
                <Text style={s.catLabel}>{c.label}</Text>
              </View>
              <Text style={s.catText}>{c.text}</Text>
            </View>
          ))}

          {/* Lucky strip */}
          <View style={s.luckyRow}>
            <View style={s.luckyItem}>
              <Text style={s.luckyLabel}>Lucky Number</Text>
              <Text style={[s.luckyValue, { color: GOLD }]}>{reading.luckyNumber}</Text>
            </View>
            <View style={s.luckySep} />
            <View style={s.luckyItem}>
              <Text style={s.luckyLabel}>Lucky Color</Text>
              <Text style={[s.luckyValue, { color: GOLD }]}>{reading.luckyColor}</Text>
            </View>
          </View>

          {/* Affirmation */}
          <LinearGradient
            colors={['rgba(245,158,11,0.12)','rgba(168,85,247,0.08)']}
            start={{x:0,y:0}} end={{x:1,y:1}}
            style={s.affirmCard}
          >
            <Text style={s.affirmLabel}>✦ Daily Affirmation</Text>
            <Text style={s.affirmText}>"{reading.affirmation}"</Text>
          </LinearGradient>
        </View>

        {/* Sign traits */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Your Sign's Energy</Text>
          <View style={s.traitsRow}>
            {meta.traits.map((t, i) => (
              <View key={i} style={[s.traitBadge, { borderColor: elemColor + '50', backgroundColor: elemColor + '14' }]}>
                <Text style={[s.traitText, { color: elemColor }]}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={s.keywordsRow}>
            {meta.keywords.map((k, i) => (
              <View key={i} style={s.keywordBadge}>
                <Text style={s.keywordText}>{k}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

const s = StyleSheet.create({
  root: { flex:1 },
  headerGrad: { paddingHorizontal:20, paddingBottom:24 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' },
  greeting: { color:'#fff', fontSize:18, fontWeight:'800' },
  date: { color: TEXT_SECONDARY, fontSize:13, marginTop:2 },
  moonBadge: { alignItems:'center', backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor: BORDER, borderRadius:14, padding:10 },
  moonEmoji: { fontSize:22 },
  moonText: { color: TEXT_SECONDARY, fontSize:10, fontWeight:'600', marginTop:2 },
  planetaryDay: { flexDirection:'row', justifyContent:'space-between', marginTop:16, backgroundColor:'rgba(255,255,255,0.04)', borderRadius:12, paddingHorizontal:14, paddingVertical:10 },
  planetaryDayText: { color: TEXT_SECONDARY, fontSize:12.5, fontWeight:'600' },
  moonPhaseName: { color: ACCENT, fontSize:12.5, fontWeight:'600' },
  section: { paddingHorizontal:20, marginBottom:8 },
  sectionTitle: { color:'#fff', fontSize:15, fontWeight:'700', marginBottom:12 },
  signCard: { borderWidth:1, borderRadius:20, padding:18, overflow:'hidden', marginBottom:4 },
  signRow: { flexDirection:'row', gap:16, alignItems:'center', marginBottom:16 },
  signIconBg: { width:54, height:54, borderRadius:16, alignItems:'center', justifyContent:'center' },
  signGlyph: { fontSize:26 },
  signName: { color:'#fff', fontSize:20, fontWeight:'800' },
  signMeta: { fontSize:12.5, fontWeight:'600', marginTop:2 },
  signDates: { color: TEXT_TERTIARY, fontSize:12, marginTop:1 },
  trinityRow: { flexDirection:'row', alignItems:'center' },
  trinityItem: { flex:1, alignItems:'center', gap:4 },
  trinityLabel: { color: TEXT_TERTIARY, fontSize:11, fontWeight:'600' },
  trinityValue: { color:'#fff', fontSize:14, fontWeight:'700' },
  trinitySep: { width:1, height:32, backgroundColor: BORDER },
  pillRow: { flexDirection:'row', gap:8, paddingHorizontal:20, marginBottom:16 },
  pill: { flex:1, paddingVertical:10, borderRadius:999, alignItems:'center', overflow:'hidden', borderWidth:1, borderColor: BORDER, backgroundColor:'rgba(255,255,255,0.04)' },
  pillActive: { borderColor:'transparent' },
  pillText: { color: TEXT_SECONDARY, fontSize:13, fontWeight:'700' },
  pillTextActive: { color:'#fff' },
  readingCard: { borderRadius:20, borderWidth:1, borderColor: ACCENT_BORDER, padding:20, marginBottom:12, overflow:'hidden' },
  overviewText: { color:'rgba(255,255,255,0.88)', fontSize:15, lineHeight:24 },
  categoryCard: { backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderRadius:16, padding:16, marginBottom:10 },
  catHeader: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:10 },
  catIconBg: { width:32, height:32, borderRadius:10, backgroundColor: ACCENT_DIM, alignItems:'center', justifyContent:'center' },
  catIcon: { color: ACCENT, fontSize:14 },
  catLabel: { color:'#fff', fontSize:13, fontWeight:'700' },
  catText: { color: TEXT_SECONDARY, fontSize:13.5, lineHeight:21 },
  luckyRow: { flexDirection:'row', backgroundColor: GOLD_DIM, borderWidth:1, borderColor:'rgba(245,158,11,0.25)', borderRadius:16, overflow:'hidden', marginBottom:10 },
  luckyItem: { flex:1, alignItems:'center', paddingVertical:16, gap:4 },
  luckySep: { width:1, backgroundColor:'rgba(245,158,11,0.2)' },
  luckyLabel: { color:'rgba(255,255,255,0.45)', fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.6 },
  luckyValue: { fontSize:16, fontWeight:'800' },
  affirmCard: { borderRadius:16, padding:20, alignItems:'center', gap:8 },
  affirmLabel: { color: GOLD, fontSize:12, fontWeight:'700', textTransform:'uppercase', letterSpacing:1 },
  affirmText: { color:'#fff', fontSize:16, fontWeight:'600', textAlign:'center', lineHeight:24, fontStyle:'italic' },
  traitsRow: { flexDirection:'row', gap:8, flexWrap:'wrap', marginBottom:10 },
  traitBadge: { paddingHorizontal:14, paddingVertical:7, borderRadius:999, borderWidth:1 },
  traitText: { fontSize:13, fontWeight:'700' },
  keywordsRow: { flexDirection:'row', gap:6, flexWrap:'wrap' },
  keywordBadge: { paddingHorizontal:12, paddingVertical:6, borderRadius:999, backgroundColor:'rgba(255,255,255,0.06)', borderWidth:1, borderColor: BORDER },
  keywordText: { color: TEXT_SECONDARY, fontSize:12, fontWeight:'600' },
  scoreRow: { flexDirection:'row', alignItems:'center', gap:10, marginBottom:8 },
  scoreLabel: { color: TEXT_SECONDARY, fontSize:12, width:90 },
  scoreTrack: { flex:1, height:6, backgroundColor:'rgba(255,255,255,0.08)', borderRadius:3, overflow:'hidden' },
  scoreFill: { height:'100%', borderRadius:3 },
  scoreValue: { color:'#fff', fontSize:12, fontWeight:'700', width:36, textAlign:'right' },
})
