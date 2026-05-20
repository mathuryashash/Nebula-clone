/**
 * Compatibility (Love) tab
 * Two-person birth chart comparison with synastry scoring
 */
import { useState, useEffect } from 'react'
import { View, ScrollView, Pressable, StyleSheet, TextInput, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import {
  ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, GOLD, GOLD_DIM, SURFACE, SURFACE2,
  TEXT_SECONDARY, TEXT_TERTIARY, FIRE_COLOR, EARTH_COLOR, AIR_COLOR, WATER_COLOR,
} from '@/lib/theme'
import { loadProfile, UserProfile } from '@/lib/userProfile'
import { getSunSign, getMoonSign, SIGN_META, calculateCompatibility, ZodiacSign, CompatibilityResult } from '@/lib/astrology'

const { width: SW } = Dimensions.get('window')

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function ScoreArc({ value, size = 120, label }: { value: number; size?: number; label: string }) {
  const angle = (value / 100) * 270 - 135
  const color = value >= 75 ? '#4ade80' : value >= 55 ? GOLD : '#f87171'
  return (
    <View style={{ alignItems:'center', gap:4 }}>
      <View style={[sa.ring, { width:size, height:size, borderColor: color + '22' }]}>
        <LinearGradient
          colors={[color + '30', color + '08']}
          style={[StyleSheet.absoluteFillObject, { borderRadius:999 }]}
        />
        <Text style={[sa.score, { color, fontSize: size * 0.28 }]}>{value}</Text>
        <Text style={[sa.pct, { color: color + 'aa', fontSize: size * 0.12 }]}>%</Text>
      </View>
      <Text style={sa.label}>{label}</Text>
    </View>
  )
}

const sa = StyleSheet.create({
  ring: { borderRadius:999, borderWidth:3, alignItems:'center', justifyContent:'center', overflow:'hidden' },
  score: { fontWeight:'800' },
  pct: { fontWeight:'700', marginTop:-4 },
  label: { color: TEXT_SECONDARY, fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.6 },
})

function BarRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={{ gap:6, marginBottom:14 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
        <Text style={{ color:'#fff', fontSize:13, fontWeight:'700' }}>{label}</Text>
        <Text style={{ color, fontSize:13, fontWeight:'800' }}>{value}%</Text>
      </View>
      <View style={bar.track}>
        <LinearGradient
          colors={[color, color + 'aa']}
          start={{x:0,y:0}} end={{x:1,y:0}}
          style={[bar.fill, { width: `${value}%` as any }]}
        />
      </View>
    </View>
  )
}

const bar = StyleSheet.create({
  track: { height:8, backgroundColor:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' },
  fill: { height:'100%', borderRadius:4 },
})

export default function CompatibilityScreen() {
  const insets = useSafeAreaInsets()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [result, setResult] = useState<CompatibilityResult | null>(null)

  // Partner form
  const [partnerName, setPartnerName] = useState('')
  const [partnerYear, setPartnerYear] = useState('1993')
  const [partnerMonth, setPartnerMonth] = useState(3)
  const [partnerDay, setPartnerDay] = useState(22)
  const [partnerHour, setPartnerHour] = useState(12)

  useEffect(() => { loadProfile().then(setProfile) }, [])

  function calculate() {
    if (!profile) return
    const partnerSun  = getSunSign(partnerMonth, partnerDay)
    const partnerMoon = getMoonSign(parseInt(partnerYear), partnerMonth, partnerDay, partnerHour)
    const r = calculateCompatibility(profile.sunSign, profile.moonSign, partnerSun, partnerMoon)
    setResult(r)
  }

  const myMeta = profile ? SIGN_META[profile.sunSign] : null

  return (
    <View style={{ flex:1, backgroundColor: BG }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <LinearGradient
          colors={['#1a0830','#0a0618','rgba(8,6,18,0)']}
          style={[s.headerGrad, { paddingTop: insets.top + 16 }]}
        >
          <Text style={s.screenTitle}>Compatibility</Text>
          <Text style={s.screenSub}>Discover your cosmic connection ♡</Text>
        </LinearGradient>

        {/* Your profile card */}
        {profile && (
          <View style={s.section}>
            <View style={s.youCard}>
              <LinearGradient colors={['rgba(168,85,247,0.12)','transparent']} style={[StyleSheet.absoluteFillObject, {borderRadius:16}]} />
              <Text style={s.youLabel}>Your Cosmic Profile</Text>
              <View style={s.youRow}>
                <Text style={s.youEmoji}>{myMeta!.symbol}</Text>
                <View>
                  <Text style={s.youName}>{profile.name ?? 'You'}</Text>
                  <Text style={s.youSigns}>☉ {profile.sunSign} · ☽ {profile.moonSign} · ↑ {profile.risingSign}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Partner input */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>✦ Their Birth Info</Text>
          <View style={s.card}>
            <Text style={s.fieldLabel}>Name (optional)</Text>
            <TextInput
              style={s.input}
              placeholder="Partner's name..."
              placeholderTextColor="rgba(255,255,255,0.22)"
              value={partnerName}
              onChangeText={setPartnerName}
            />
            <Text style={[s.fieldLabel, { marginTop:16 }]}>Birth Year</Text>
            <TextInput
              style={s.input}
              placeholder="1993"
              placeholderTextColor="rgba(255,255,255,0.22)"
              value={partnerYear}
              onChangeText={setPartnerYear}
              keyboardType="numeric"
              maxLength={4}
            />
            <Text style={[s.fieldLabel, { marginTop:16 }]}>Birth Month</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal:-4 }}>
              <View style={{ flexDirection:'row', gap:6, paddingHorizontal:4 }}>
                {MONTHS.map((m, i) => (
                  <Pressable key={m} onPress={() => setPartnerMonth(i+1)} style={[s.chip, partnerMonth === i+1 && s.chipActive]}>
                    <Text style={[s.chipText, partnerMonth === i+1 && s.chipTextActive]}>{m}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
            <Text style={[s.fieldLabel, { marginTop:16 }]}>Birth Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection:'row', gap:6 }}>
                {Array.from({length:31},(_,i) => i+1).map(d => (
                  <Pressable key={d} onPress={() => setPartnerDay(d)} style={[s.dayChip, partnerDay === d && s.chipActive]}>
                    <Text style={[s.chipText, partnerDay === d && s.chipTextActive]}>{d}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>

            {/* Sun sign preview */}
            {partnerYear.length === 4 && (
              <View style={s.signPreview}>
                <Text style={s.signPreviewLabel}>Their Sun Sign</Text>
                <Text style={s.signPreviewValue}>
                  {SIGN_META[getSunSign(partnerMonth, partnerDay)].symbol} {getSunSign(partnerMonth, partnerDay)}
                </Text>
              </View>
            )}

            <Pressable onPress={calculate} disabled={!profile || partnerYear.length < 4} style={[s.calcBtn, (!profile || partnerYear.length < 4) && {opacity:0.4}]}>
              <LinearGradient colors={['#ec4899','#a855f7']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.calcGrad}>
                <Text style={s.calcText}>♡ Calculate Compatibility</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Results */}
        {result && profile && (
          <View style={s.section}>
            {/* Overall score */}
            <View style={s.overallCard}>
              <LinearGradient
                colors={['rgba(236,72,153,0.15)','rgba(168,85,247,0.15)','transparent']}
                start={{x:0,y:0}} end={{x:1,y:1}}
                style={[StyleSheet.absoluteFillObject, {borderRadius:20}]}
              />
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <View>
                  <Text style={s.pairText}>{profile.sunSign} {SIGN_META[profile.sunSign].symbol}</Text>
                  <Text style={s.pairSub}>☉ {profile.sunSign}</Text>
                </View>
                <Text style={s.heartSep}>♡</Text>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={s.pairText}>{getSunSign(partnerMonth, partnerDay)} {SIGN_META[getSunSign(partnerMonth, partnerDay)].symbol}</Text>
                  <Text style={s.pairSub}>☉ {getSunSign(partnerMonth, partnerDay)}</Text>
                </View>
              </View>
              <View style={{ alignItems:'center', marginBottom:20 }}>
                <ScoreArc value={result.overall} size={130} label="Overall Match" />
              </View>
              <Text style={s.summaryText}>{result.summary}</Text>
            </View>

            {/* Category scores */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Compatibility Breakdown</Text>
              <BarRow label="♡ Love & Romance"   value={result.love}          color="#ec4899" />
              <BarRow label="☿ Communication"    value={result.communication} color="#38bdf8" />
              <BarRow label="♀ Shared Values"    value={result.values}        color="#84cc16" />
              <BarRow label="♂ Passion & Drive"  value={result.passion}       color="#f97316" />
            </View>

            {/* Strengths & challenges */}
            <View style={s.card}>
              <Text style={s.cardTitle}>What the Stars Say</Text>
              <Text style={[s.scLabel, { color:'#4ade80' }]}>✦ Strengths</Text>
              {result.strengths.map((str, i) => (
                <View key={i} style={[s.scRow, { backgroundColor:'rgba(74,222,128,0.07)', borderColor:'rgba(74,222,128,0.2)' }]}>
                  <Text style={[s.scText, { color:'rgba(255,255,255,0.85)' }]}>{str}</Text>
                </View>
              ))}
              <Text style={[s.scLabel, { color:'#f87171', marginTop:16 }]}>⚡ Challenges</Text>
              {result.challenges.map((ch, i) => (
                <View key={i} style={[s.scRow, { backgroundColor:'rgba(248,113,113,0.07)', borderColor:'rgba(248,113,113,0.2)' }]}>
                  <Text style={[s.scText, { color:'rgba(255,255,255,0.8)' }]}>{ch}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  headerGrad: { paddingHorizontal:20, paddingBottom:20 },
  screenTitle: { color:'#fff', fontSize:24, fontWeight:'800' },
  screenSub: { color: TEXT_SECONDARY, fontSize:13, marginTop:4 },
  section: { paddingHorizontal:20, marginBottom:12 },
  sectionTitle: { color:'#fff', fontSize:16, fontWeight:'700', marginBottom:12 },
  youCard: { borderRadius:16, borderWidth:1, borderColor:'rgba(168,85,247,0.3)', padding:16, overflow:'hidden', marginBottom:4 },
  youLabel: { color: TEXT_TERTIARY, fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8, marginBottom:10 },
  youRow: { flexDirection:'row', alignItems:'center', gap:12 },
  youEmoji: { fontSize:32 },
  youName: { color:'#fff', fontSize:16, fontWeight:'800' },
  youSigns: { color: TEXT_SECONDARY, fontSize:12, marginTop:2 },
  card: { backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderRadius:20, padding:20, marginBottom:12 },
  cardTitle: { color:'#fff', fontSize:15, fontWeight:'700', marginBottom:16 },
  fieldLabel: { color:'rgba(255,255,255,0.45)', fontSize:12, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8, marginBottom:8 },
  input: { backgroundColor: SURFACE2, borderWidth:1, borderColor: BORDER, borderRadius:12, paddingHorizontal:16, paddingVertical:14, color:'#fff', fontSize:15 },
  chip: { paddingHorizontal:12, paddingVertical:8, borderRadius:999, borderWidth:1, borderColor: BORDER, backgroundColor:'rgba(255,255,255,0.04)' },
  chipActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BORDER },
  dayChip: { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor: BORDER, backgroundColor:'rgba(255,255,255,0.04)' },
  chipText: { color: TEXT_SECONDARY, fontSize:12, fontWeight:'600' },
  chipTextActive: { color: ACCENT, fontWeight:'700' },
  signPreview: { marginTop:16, backgroundColor:'rgba(168,85,247,0.08)', borderRadius:12, padding:14, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  signPreviewLabel: { color: TEXT_SECONDARY, fontSize:13 },
  signPreviewValue: { color:'#fff', fontSize:16, fontWeight:'800' },
  calcBtn: { marginTop:20, borderRadius:999, overflow:'hidden' },
  calcGrad: { paddingVertical:16, alignItems:'center' },
  calcText: { color:'#fff', fontSize:16, fontWeight:'800' },
  overallCard: { borderRadius:20, borderWidth:1, borderColor:'rgba(236,72,153,0.3)', padding:20, overflow:'hidden', marginBottom:12 },
  pairText: { color:'#fff', fontSize:16, fontWeight:'800' },
  pairSub: { color: TEXT_SECONDARY, fontSize:12 },
  heartSep: { color:'#ec4899', fontSize:28 },
  summaryText: { color: TEXT_SECONDARY, fontSize:14, lineHeight:22 },
  scLabel: { fontSize:13, fontWeight:'700', marginBottom:8 },
  scRow: { borderRadius:12, borderWidth:1, padding:12, marginBottom:6 },
  scText: { fontSize:13, lineHeight:20 },
})
