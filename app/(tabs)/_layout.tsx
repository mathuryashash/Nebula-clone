import { Tabs } from 'expo-router'
import { View, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import { ACCENT, BG, BORDER, TAB_INACTIVE } from '@/lib/theme'

interface TabIconProps {
  glyph: string
  label: string
  focused: boolean
}

function TabIcon({ glyph, label, focused }: TabIconProps) {
  return (
    <View style={[ti.wrap, focused && ti.wrapActive]}>
      <Text style={[ti.glyph, focused && ti.glyphActive]}>{glyph}</Text>
      <Text style={[ti.label, focused && ti.labelActive]}>{label}</Text>
    </View>
  )
}

const ti = StyleSheet.create({
  wrap: { alignItems:'center', justifyContent:'center', paddingTop: 6, gap: 3 },
  wrapActive: {},
  glyph: { fontSize: 20, color: TAB_INACTIVE },
  glyphActive: { color: ACCENT },
  label: { fontSize: 10, fontWeight:'600', color: TAB_INACTIVE },
  labelActive: { color: ACCENT },
})

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + insets.bottom,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(8,6,18,0.92)', '#080612']}
            style={[StyleSheet.absoluteFillObject, { borderTopWidth: 1, borderTopColor: BORDER }]}
          />
        ),
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="☉" label="Today" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="◎" label="Chart" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="compatibility"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="♡" label="Love" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon glyph="✦" label="Astrologer" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
