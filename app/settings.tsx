import { View, ScrollView, Pressable, StyleSheet, Alert } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, BG, BORDER, SURFACE, TEXT_SECONDARY, TEXT_TERTIARY } from '@/lib/theme'
import { clearProfile } from '@/lib/userProfile'
import { supabase, isSupabaseEnabled } from '@/lib/supabase'

function Row({ icon, label, onPress, destructive }: { icon: string; label: string; onPress: () => void; destructive?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity:0.7 }]}>
      <View style={s.rowIcon}><Text style={s.rowIconText}>{icon}</Text></View>
      <Text style={[s.rowLabel, destructive && { color:'#f87171' }]}>{label}</Text>
      <Text style={s.rowArrow}>›</Text>
    </Pressable>
  )
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()

  async function handleSignOut() {
    await clearProfile()
    if (isSupabaseEnabled) await supabase.auth.signOut()
    router.replace('/')
  }

  async function handleReset() {
    Alert.alert('Reset Chart', 'This will clear your birth data and restart onboarding.', [
      { text:'Cancel', style:'cancel' },
      { text:'Reset', style:'destructive', onPress: async () => {
        await clearProfile()
        if (isSupabaseEnabled) {
          await supabase.auth.updateUser({ data: { onboarding_completed: false } })
        }
        router.replace('/(onboarding)')
      }},
    ])
  }

  return (
    <View style={{ flex:1, backgroundColor: BG }}>
      <LinearGradient colors={['#160d2e','#0a0618','rgba(8,6,18,0)']} style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={() => router.back()} style={s.back}><Text style={s.backText}>← Back</Text></Pressable>
        <Text style={s.title}>Settings</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingHorizontal:20, paddingBottom: insets.bottom + 40 }}>
        <Text style={s.sectionLabel}>Your Chart</Text>
        <View style={s.card}>
          <Row icon="✎" label="Update Birth Data" onPress={handleReset} />
        </View>
        <Text style={s.sectionLabel}>App</Text>
        <View style={s.card}>
          <Row icon="📄" label="Privacy Policy" onPress={() => router.push('/privacy')} />
          <Row icon="📋" label="Terms of Service" onPress={() => router.push('/terms')} />
          <Row icon="✉️" label="Support" onPress={() => router.push('/support')} />
        </View>
        <Text style={s.sectionLabel}>Account</Text>
        <View style={s.card}>
          <Row icon="↩" label="Sign Out" onPress={handleSignOut} destructive />
        </View>
        <Text style={s.version}>Nebula v1.0 · Made with ✦</Text>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  header: { paddingHorizontal:20, paddingBottom:20 },
  back: { marginBottom:8 },
  backText: { color:'rgba(255,255,255,0.4)', fontSize:15 },
  title: { color:'#fff', fontSize:24, fontWeight:'800' },
  sectionLabel: { color: TEXT_TERTIARY, fontSize:12, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.8, marginTop:24, marginBottom:8 },
  card: { backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderRadius:16, overflow:'hidden' },
  row: { flexDirection:'row', alignItems:'center', gap:12, paddingHorizontal:16, paddingVertical:16, borderBottomWidth:1, borderBottomColor: BORDER },
  rowIcon: { width:32, height:32, borderRadius:10, backgroundColor:'rgba(255,255,255,0.06)', alignItems:'center', justifyContent:'center' },
  rowIconText: { fontSize:14 },
  rowLabel: { flex:1, color:'#fff', fontSize:15, fontWeight:'500' },
  rowArrow: { color: TEXT_TERTIARY, fontSize:20 },
  version: { color: TEXT_TERTIARY, textAlign:'center', fontSize:12, marginTop:40 },
})
