import { useEffect } from 'react'
import { View, Pressable, StyleSheet, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withDelay, withRepeat, withSequence, Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, ACCENT_DIM, BG, BORDER, GOLD } from '@/lib/theme'
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants'

const { width: SW, height: SH } = Dimensions.get('window')

const FEATURES = [
  { icon: '✦', title: 'Daily Horoscopes', desc: 'Personalized readings for your Sun, Moon & Rising' },
  { icon: '◉', title: 'Birth Chart Generator', desc: 'Full natal chart with planetary breakdown' },
  { icon: '♡', title: 'Compatibility Reports', desc: 'Deep synastry analysis between two charts' },
]

export default function LandingScreen() {
  const insets = useSafeAreaInsets()
  const headerOpacity = useSharedValue(0)
  const heroOpacity = useSharedValue(0)
  const heroY = useSharedValue(24)
  const featuresOpacity = useSharedValue(0)
  const footerOpacity = useSharedValue(0)
  const starOneY = useSharedValue(0)
  const starTwoY = useSharedValue(0)
  const orbOpacity = useSharedValue(0)

  useEffect(() => {
    orbOpacity.value = withTiming(1, { duration: 1200 })
    headerOpacity.value = withDelay(200, withTiming(1, { duration: 600 }))
    heroOpacity.value = withDelay(400, withTiming(1, { duration: 700 }))
    heroY.value = withDelay(400, withSpring(0, { damping: 18, stiffness: 90 }))
    featuresOpacity.value = withDelay(700, withTiming(1, { duration: 600 }))
    footerOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }))
    starOneY.value = withRepeat(withSequence(
      withTiming(-18, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.sin) })
    ), -1, true)
    starTwoY.value = withRepeat(withSequence(
      withTiming(14, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.sin) })
    ), -1, true)
  }, [])

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }))
  const heroStyle = useAnimatedStyle(() => ({ opacity: heroOpacity.value, transform: [{ translateY: heroY.value }] }))
  const featuresStyle = useAnimatedStyle(() => ({ opacity: featuresOpacity.value }))
  const footerStyle = useAnimatedStyle(() => ({ opacity: footerOpacity.value }))
  const orbStyle = useAnimatedStyle(() => ({ opacity: orbOpacity.value }))
  const starOneStyle = useAnimatedStyle(() => ({ transform: [{ translateY: starOneY.value }] }))
  const starTwoStyle = useAnimatedStyle(() => ({ transform: [{ translateY: starTwoY.value }] }))

  return (
    <View style={s.root}>
      <LinearGradient
        pointerEvents="none"
        colors={['#080612', '#0f0821', '#12062a', '#080612']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Decorative orbs */}
      <Animated.View pointerEvents="none" style={[s.orbPurple, orbStyle]} />
      <Animated.View pointerEvents="none" style={[s.orbGold, orbStyle]} />
      <Animated.View pointerEvents="none" style={[s.starCluster1, starOneStyle]}>
        {['✦','·','★','·','✦','·'].map((s2, i) => (
          <Text key={i} style={[s.starText, { opacity: 0.15 + i * 0.06 }]}>{s2}</Text>
        ))}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[s.starCluster2, starTwoStyle]}>
        {['·','✦','·','★'].map((s2, i) => (
          <Text key={i} style={[s.starText, { opacity: 0.1 + i * 0.06 }]}>{s2}</Text>
        ))}
      </Animated.View>

      {/* Header */}
      <Animated.View style={[s.header, { marginTop: insets.top + 12 }, headerStyle]}>
        <View style={s.logoRow}>
          <LinearGradient colors={['#c084fc','#7c3aed']} style={s.logoGrad}>
            <Text style={s.logoText}>☽</Text>
          </LinearGradient>
          <Text style={s.logoName}>{APP_NAME}</Text>
        </View>
        <Pressable onPress={() => router.push('/(auth)/login')} style={({ pressed }) => [s.ctaBtn, pressed && { opacity: 0.8 }]}>
          <LinearGradient colors={['#a855f7','#7c3aed']} start={{ x:0, y:0 }} end={{ x:1, y:0 }} style={s.ctaGrad}>
            <Text style={s.ctaText}>Begin</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Hero */}
      <Animated.View style={[s.hero, heroStyle]}>
        <Text style={s.heroMoon}>☽</Text>
        <Text style={s.heroTitle}>{APP_NAME}</Text>
        <Text style={s.heroTagline}>{APP_TAGLINE}</Text>
        <Text style={s.heroDesc}>{APP_DESCRIPTION}</Text>
      </Animated.View>

      {/* Features */}
      <Animated.View style={[s.features, featuresStyle]}>
        {FEATURES.map((f, i) => (
          <View key={i} style={s.featureRow}>
            <View style={s.featureIcon}>
              <Text style={s.featureIconText}>{f.icon}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={s.featureTitle}>{f.title}</Text>
              <Text style={s.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[s.footer, { paddingBottom: insets.bottom + 24 }, footerStyle]}>
        <Pressable onPress={() => router.push('/(auth)/login')} style={({ pressed }) => [pressed && { opacity: 0.7 }]}>
          <Text style={s.signIn}>Already have an account? <Text style={{ color: ACCENT }}>Sign in</Text></Text>
        </Pressable>
        <Text style={s.legal}>
          By continuing you agree to our{' '}
          <Text onPress={() => router.push('/terms')} style={s.legalLink}>Terms</Text>
          {' '}and{' '}
          <Text onPress={() => router.push('/privacy')} style={s.legalLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  orbPurple: { position:'absolute', right: -SW*0.3, top: SH*0.05, width: SW*0.8, height: SW*0.8, borderRadius:999, backgroundColor:'rgba(168,85,247,0.12)' },
  orbGold:   { position:'absolute', left: -SW*0.35, bottom: SH*0.15, width: SW*0.7, height: SW*0.7, borderRadius:999, backgroundColor:'rgba(245,158,11,0.06)' },
  starCluster1: { position:'absolute', top: SH*0.1, left: 20, flexDirection:'row', gap: 8 },
  starCluster2: { position:'absolute', top: SH*0.35, right: 24, flexDirection:'row', gap: 6 },
  starText: { color:'#d8b4fe', fontSize: 14 },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal: 20 },
  logoRow: { flexDirection:'row', alignItems:'center', gap: 10 },
  logoGrad: { width:38, height:38, borderRadius:999, alignItems:'center', justifyContent:'center' },
  logoText: { fontSize:18, color:'#fff' },
  logoName: { color:'#fff', fontSize:16, fontWeight:'800', letterSpacing:0.3 },
  ctaBtn: { borderRadius:999, overflow:'hidden' },
  ctaGrad: { paddingHorizontal:20, paddingVertical:10, borderRadius:999 },
  ctaText: { color:'#fff', fontSize:13, fontWeight:'700' },
  hero: { paddingHorizontal:24, paddingTop: 40, gap:10 },
  heroMoon: { fontSize:48, marginBottom:4 },
  heroTitle: { color:'#fff', fontSize:38, fontWeight:'800', letterSpacing:-1 },
  heroTagline: { color: GOLD, fontSize:16, fontWeight:'600' },
  heroDesc: { color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:22, maxWidth:320, marginTop:4 },
  features: { flex:1, justifyContent:'center', paddingHorizontal:24, gap:12 },
  featureRow: { flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'rgba(168,85,247,0.07)', borderWidth:1, borderColor:'rgba(168,85,247,0.18)', borderRadius:16, paddingVertical:14, paddingHorizontal:16 },
  featureIcon: { width:40, height:40, borderRadius:12, backgroundColor:ACCENT_DIM, alignItems:'center', justifyContent:'center' },
  featureIconText: { color:ACCENT, fontSize:18 },
  featureTitle: { color:'#fff', fontSize:14, fontWeight:'700' },
  featureDesc: { color:'rgba(255,255,255,0.42)', fontSize:12.5 },
  footer: { paddingHorizontal:20, gap:10, alignItems:'center' },
  signIn: { color:'rgba(255,255,255,0.35)', fontSize:13 },
  legal: { color:'rgba(255,255,255,0.2)', textAlign:'center', fontSize:11, lineHeight:17 },
  legalLink: { color:'rgba(255,255,255,0.36)', textDecorationLine:'underline' },
})
