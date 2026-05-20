import { View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Text } from '@/components/ui/Text'
import { BG } from '@/lib/theme'
import { Pressable } from 'react-native'

export default function DetailScreen() {
  return (
    <View style={{ flex:1, backgroundColor: BG, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ color:'#fff', fontSize:24 }}>✦</Text>
      <Pressable onPress={() => router.back()}>
        <Text style={{ color:'rgba(255,255,255,0.4)', marginTop:12 }}>← Go Back</Text>
      </Pressable>
    </View>
  )
}
