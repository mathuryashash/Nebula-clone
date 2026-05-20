/**
 * Chart tab — Birth Chart Generator
 * Full natal chart wheel + planet breakdown table
 */
import { useState, useEffect } from 'react'
import { View, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { BirthChartWheel } from '@/components/BirthChartWheel'
import {
  ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, GOLD, GOLD_DIM, SURFACE, SURFACE2,
  TEXT_SECONDARY, TEXT_TERTIARY, FIRE_COLOR, EARTH_COLOR, AIR_COLOR, WATER_COLOR,
} from '@/lib/theme'
import { loadProfile, UserProfile } from '@/lib/userProfile'
import { calculateBirthChart, BirthChart, SIGN_META, PlanetPosition } from '@/lib/astrology'

const ELEMENT_COLORS: Record<string, string> = {
  Fire: FIRE_COLOR, Earth: EARTH_COLOR, Air: AIR_COLOR, Water: WATER_COLOR,
}

function PlanetRow({ p }: { p: PlanetPosition }) {
  const meta = SIGN_META[p.sign]
  const elemColor = ELEMENT_COLORS[meta.element]
  return (
    <View style={pr.row}>
      <View style={[pr.iconBg, { backgroundColor: elemColor + '20' }]}>
        <Text style={[pr.glyph, { color: elemColor }]}>{p.glyph}</Text>
      </View>
      <View style={{ flex:1 }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
          <Text style={pr.planet}>{p.planet}</Text>
          {p.retrograde && <Text style={pr.rx}>℞ Rx</Text>}
        </View>
        <Text style={pr.sign}>{meta.symbol} {p.sign} · House {p.house}</Text>
      </View>
      <View style={[pr.degreeBg, { borderColor: elemColor + '40' }]}>
        <Text style={[pr.degree, { color: elemColor }]}>{p.degree}°</Text>
      </View>
    </View>
  )
}

const pr = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:12, borderBottomWidth:1, borderBottomColor: BORDER },
  iconBg: { width:40, height:40, borderRadius:12, alignItems:'center', justifyContent:'center' },
  glyph: { fontSize:20, fontWeight:'bold' },
  planet: { color:'#fff', fontSize:14, fontWeight:'700' },
  rx: { color:'#f87171', fontSize:10, fontWeight:'700', backgroundColor:'rgba(248,113,113,0.12)', paddingHorizontal:5, paddingVertical:2, borderRadius:4 },
  sign: { color: TEXT_SECONDARY, fontSize:12, marginTop:1 },
  degreeBg: { paddingHorizontal:10, paddingVertical:5, borderRadius:8, borderWidth:1 },
  degree: { fontSize:13, fontWeight:'700' },
})

export default function ChartScreen() {
  const insets = useSafeAreaInsets()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [chart, setChart] = useState<BirthChart | null>(null)
  const [activeTab, setActiveTab] = useState<'chart'|'planets'|'houses'>('chart')

  useEffect(() => {
    loadProfile().then(p => {
      if (p) {
        setProfile(p)
        setChart(calculateBirthChart(p.birthData))
      }
    })
  }, [])

  if (!profile || !chart) {
    return (
      <View style={{ flex:1, backgroundColor: BG, alignItems:'center', justifyContent:'center', gap:16 }}>
        <Text style={{ fontSize:48 }}>◉</Text>
        <Text style={{ color:'#fff', fontSize:18, fontWeight:'800' }}>No Chart Yet</Text>
        <Text style={{ color: TEXT_SECONDARY, textAlign:'center', paddingHorizontal:40, lineHeight:22 }}>
          Complete onboarding to generate your natal chart.
        </Text>
      </View>
    )
  }

  const elemCount: Record<string, number> = { Fire:0, Earth:0, Air:0, Water:0 }
  chart.planets.slice(0,7).forEach(p => elemCount[SIGN_META[p.sign].element]++)

  return (
    <View style={{ flex:1, backgroundColor: BG }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        {/* Header */}
        <LinearGradient
          colors={['#160d2e','#0a0618','rgba(8,6,18,0)']}
          style={[s.headerGrad, { paddingTop: insets.top + 16 }]}
        >
          <Text style={s.screenTitle}>Birth Chart</Text>
          <Text style={s.screenSub}>{profile.name ?? 'Your'} Natal Chart · {profile.birthData.year}</Text>
        </LinearGradient>

        {/* Sign Trinity Banner */}
        <View style={s.trinity}>
          {[
            { label:'☉ Sun',    value: chart.sunSign,     emoji: SIGN_META[chart.sunSign].symbol },
            { label:'☽ Moon',   value: chart.moonSign,    emoji: SIGN_META[chart.moonSign].symbol },
            { label:'↑ Rising', value: chart.risingSign,  emoji: SIGN_META[chart.risingSign].symbol },
          ].map((item, i) => (
            <View key={i} style={s.trinityItem}>
              <Text style={s.trinityEmoji}>{item.emoji}</Text>
              <Text style={s.trinityValue}>{item.value}</Text>
              <Text style={s.trinityLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Sub-tab selector */}
        <View style={s.tabRow}>
          {(['chart','planets','houses'] as const).map(t => (
            <Pressable key={t} onPress={() => setActiveTab(t)} style={[s.subTab, activeTab === t && s.subTabActive]}>
              <Text style={[s.subTabText, activeTab === t && s.subTabTextActive]}>
                {t === 'chart' ? '◎ Wheel' : t === 'planets' ? '♃ Planets' : '⌂ Houses'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Wheel */}
        {activeTab === 'chart' && (
          <View style={{ alignItems:'center', paddingHorizontal:16, paddingTop:8 }}>
            <BirthChartWheel chart={chart} size={340} />

            {/* Element balance */}
            <View style={s.elementRow}>
              {Object.entries(elemCount).map(([elem, count]) => (
                <View key={elem} style={[s.elemBadge, { borderColor: (ELEMENT_COLORS[elem] || '#fff') + '50' }]}>
                  <Text style={[s.elemValue, { color: ELEMENT_COLORS[elem] }]}>{count}</Text>
                  <Text style={s.elemName}>{elem}</Text>
                </View>
              ))}
            </View>

            <View style={s.dominantRow}>
              <View style={s.dominantItem}>
                <Text style={s.dominantLabel}>Dominant Element</Text>
                <Text style={[s.dominantValue, { color: ELEMENT_COLORS[chart.dominantElement] }]}>
                  {chart.dominantElement}
                </Text>
              </View>
              <View style={s.dominantSep} />
              <View style={s.dominantItem}>
                <Text style={s.dominantLabel}>Dominant Modality</Text>
                <Text style={[s.dominantValue, { color: GOLD }]}>{chart.dominantModality}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Planet breakdown */}
        {activeTab === 'planets' && (
          <View style={{ paddingHorizontal:20, paddingTop:8 }}>
            <Text style={s.tableHeader}>Planetary Positions</Text>
            {chart.planets.map(p => <PlanetRow key={p.planet} p={p} />)}
            <View style={s.retroNote}>
              <Text style={s.retroText}>℞ indicates retrograde motion at time of birth. Planets in retrograde invite deeper reflection on their themes.</Text>
            </View>
          </View>
        )}

        {/* House breakdown */}
        {activeTab === 'houses' && (
          <View style={{ paddingHorizontal:20, paddingTop:8 }}>
            <Text style={s.tableHeader}>House Cusps (Equal House)</Text>
            {chart.houses.map(h => {
              const meta = SIGN_META[h.sign]
              const elemColor = ELEMENT_COLORS[meta.element]
              const meanings: Record<number, string> = {
                1:'Self & Identity', 2:'Money & Values', 3:'Communication', 4:'Home & Roots',
                5:'Creativity & Joy', 6:'Health & Service', 7:'Partnerships', 8:'Transformation',
                9:'Philosophy & Travel', 10:'Career & Status', 11:'Community & Hopes', 12:'Solitude & Hidden',
              }
              return (
                <View key={h.house} style={s.houseRow}>
                  <View style={[s.houseNum, { backgroundColor: elemColor + '22', borderColor: elemColor + '40' }]}>
                    <Text style={[s.houseNumText, { color: elemColor }]}>{h.house}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                      <Text style={s.houseMeaning}>{meanings[h.house]}</Text>
                    </View>
                    <Text style={s.houseSign}>{meta.symbol} {h.sign} · {h.degree}°</Text>
                  </View>
                </View>
              )
            })}
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
  trinity: { flexDirection:'row', paddingHorizontal:20, gap:8, marginBottom:16 },
  trinityItem: { flex:1, backgroundColor: SURFACE, borderWidth:1, borderColor:'rgba(168,85,247,0.25)', borderRadius:16, padding:14, alignItems:'center', gap:4 },
  trinityEmoji: { fontSize:22 },
  trinityValue: { color:'#fff', fontSize:14, fontWeight:'800' },
  trinityLabel: { color: TEXT_TERTIARY, fontSize:11, fontWeight:'600' },
  tabRow: { flexDirection:'row', paddingHorizontal:20, gap:8, marginBottom:8 },
  subTab: { flex:1, paddingVertical:10, borderRadius:12, alignItems:'center', backgroundColor:'rgba(255,255,255,0.04)', borderWidth:1, borderColor: BORDER },
  subTabActive: { backgroundColor: ACCENT_DIM, borderColor: ACCENT_BORDER },
  subTabText: { color: TEXT_SECONDARY, fontSize:12, fontWeight:'700' },
  subTabTextActive: { color: ACCENT },
  elementRow: { flexDirection:'row', gap:8, marginTop:16, marginBottom:8 },
  elemBadge: { flex:1, alignItems:'center', borderRadius:12, borderWidth:1, paddingVertical:10, gap:4, backgroundColor:'rgba(255,255,255,0.04)' },
  elemValue: { fontSize:18, fontWeight:'800' },
  elemName: { color: TEXT_TERTIARY, fontSize:10, fontWeight:'600' },
  dominantRow: { flexDirection:'row', width:'100%', backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderRadius:16, overflow:'hidden', marginTop:4 },
  dominantItem: { flex:1, alignItems:'center', paddingVertical:14, gap:4 },
  dominantSep: { width:1, backgroundColor: BORDER },
  dominantLabel: { color: TEXT_TERTIARY, fontSize:11, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.5 },
  dominantValue: { fontSize:15, fontWeight:'800' },
  tableHeader: { color:'#fff', fontSize:15, fontWeight:'700', marginBottom:8 },
  retroNote: { marginTop:16, backgroundColor:'rgba(248,113,113,0.07)', borderRadius:12, padding:14 },
  retroText: { color: TEXT_SECONDARY, fontSize:12.5, lineHeight:20 },
  houseRow: { flexDirection:'row', alignItems:'center', gap:12, paddingVertical:11, borderBottomWidth:1, borderBottomColor: BORDER },
  houseNum: { width:36, height:36, borderRadius:10, alignItems:'center', justifyContent:'center', borderWidth:1 },
  houseNumText: { fontSize:14, fontWeight:'800' },
  houseMeaning: { color:'#fff', fontSize:13, fontWeight:'700' },
  houseSign: { color: TEXT_SECONDARY, fontSize:12, marginTop:1 },
})
