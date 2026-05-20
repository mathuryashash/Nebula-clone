/**
 * AI Astrologer Chat tab
 * Groq-powered conversational astrologer with user chart context
 */
import { useState, useEffect, useRef } from 'react'
import {
  View, ScrollView, Pressable, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from '@/components/ui/Text'
import {
  ACCENT, ACCENT_DIM, ACCENT_BORDER, BG, BORDER, GOLD, SURFACE, SURFACE2,
  TEXT_SECONDARY, TEXT_TERTIARY,
} from '@/lib/theme'
import { loadProfile, UserProfile } from '@/lib/userProfile'
import { buildSystemPrompt, sendMessage, ChatMessage } from '@/lib/groq'

const { width: SW } = Dimensions.get('window')

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? ''

const SUGGESTED_PROMPTS = [
  "What does my Sun-Moon combination say about my emotional nature?",
  "What career paths align with my birth chart?",
  "How is Mercury affecting communication for me this week?",
  "What should I know about my Rising sign?",
  "What are my chart's biggest strengths?",
  "What is my biggest cosmic challenge to overcome?",
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <View style={[mb.wrap, isUser && mb.wrapUser]}>
      {!isUser && (
        <View style={mb.avatar}>
          <LinearGradient colors={['#c084fc','#7c3aed']} style={mb.avatarGrad}>
            <Text style={mb.avatarText}>☽</Text>
          </LinearGradient>
        </View>
      )}
      <View style={[mb.bubble, isUser ? mb.bubbleUser : mb.bubbleAssistant]}>
        {!isUser && <Text style={mb.agentName}>Nebula ✦</Text>}
        <Text style={[mb.text, isUser && mb.textUser]}>{msg.content}</Text>
        <Text style={mb.time}>{msg.timestamp.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</Text>
      </View>
    </View>
  )
}

const mb = StyleSheet.create({
  wrap: { flexDirection:'row', gap:10, marginBottom:16, paddingHorizontal:16, alignItems:'flex-end' },
  wrapUser: { flexDirection:'row-reverse' },
  avatar: { width:32, height:32 },
  avatarGrad: { width:32, height:32, borderRadius:999, alignItems:'center', justifyContent:'center' },
  avatarText: { fontSize:16 },
  bubble: { maxWidth: SW * 0.72, borderRadius:18, padding:14 },
  bubbleUser: { backgroundColor: ACCENT, borderBottomRightRadius:4 },
  bubbleAssistant: { backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderBottomLeftRadius:4 },
  agentName: { color: ACCENT, fontSize:11, fontWeight:'800', marginBottom:6, textTransform:'uppercase', letterSpacing:0.8 },
  text: { color:'rgba(255,255,255,0.9)', fontSize:14, lineHeight:22 },
  textUser: { color:'#fff' },
  time: { color:'rgba(255,255,255,0.3)', fontSize:10, marginTop:6, textAlign:'right' },
})

function TypingIndicator() {
  return (
    <View style={[mb.wrap, { paddingHorizontal:16 }]}>
      <View style={mb.avatar}>
        <LinearGradient colors={['#c084fc','#7c3aed']} style={mb.avatarGrad}>
          <Text style={mb.avatarText}>☽</Text>
        </LinearGradient>
      </View>
      <View style={[mb.bubble, mb.bubbleAssistant, { flexDirection:'row', gap:4, paddingVertical:16, paddingHorizontal:16 }]}>
        {[0,1,2].map(i => (
          <View key={i} style={ti.dot} />
        ))}
      </View>
    </View>
  )
}

const ti = StyleSheet.create({
  dot: { width:6, height:6, borderRadius:3, backgroundColor: ACCENT, opacity:0.6 },
})

export default function ChatScreen() {
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    loadProfile().then(p => {
      setProfile(p)
      // Welcome message
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        content: p
          ? `✨ Welcome back, ${p.name ?? 'Stargazer'}. I'm Nebula, your personal AI astrologer.\n\nWith your ${p.sunSign} Sun, ${p.moonSign} Moon, and ${p.risingSign} Rising, there's so much the cosmos has to reveal. What's on your mind?`
          : `✨ Welcome, Stargazer. I'm Nebula, your personal AI astrologer.\n\nAsk me anything about astrology, your chart, current planetary transits, or what the stars suggest for your life path. I'm here to guide you.`,
        timestamp: new Date(),
      }
      setMessages([welcome])
    })
  }, [])

  async function sendMsg(text: string) {
    const userText = text.trim()
    if (!userText || loading) return

    setShowSuggestions(false)
    setInput('')

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    }
    const updatedMsgs = [...messages, userMsg]
    setMessages(updatedMsgs)
    setLoading(true)

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)

    try {
      const ctx = profile ? {
        sunSign: profile.sunSign,
        moonSign: profile.moonSign,
        risingSign: profile.risingSign,
        birthDate: `${profile.birthData.day}/${profile.birthData.month}/${profile.birthData.year}`,
      } : {}

      const systemPrompt = buildSystemPrompt(ctx)

      const apiMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        // Include last 8 messages for context
        ...updatedMsgs.slice(-8).map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ]

      let responseText: string

      if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
        // Demo mode fallback
        await new Promise(r => setTimeout(r, 1200))
        responseText = getDemoResponse(userText, profile)
      } else {
        responseText = await sendMessage(apiMessages, GROQ_API_KEY)
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✦ The stars have gone quiet for a moment. (${err.message})\n\nPlease ensure your Groq API key is set in your .env file.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex:1, backgroundColor: BG }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <LinearGradient
        colors={['#160d2e','#0a0618','rgba(8,6,18,0)']}
        style={[s.headerGrad, { paddingTop: insets.top + 16 }]}
      >
        <View style={s.headerRow}>
          <View style={s.agentCard}>
            <LinearGradient colors={['#c084fc','#7c3aed']} style={s.agentAvatar}>
              <Text style={s.agentAvatarText}>☽</Text>
            </LinearGradient>
            <View>
              <Text style={s.agentName}>Nebula</Text>
              <View style={s.onlineRow}>
                <View style={s.onlineDot} />
                <Text style={s.onlineText}>AI Astrologer · Online</Text>
              </View>
            </View>
          </View>
          {profile && (
            <View style={s.chartBadge}>
              <Text style={s.chartBadgeText}>☉ {profile.sunSign}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop:16, paddingBottom:20 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {loading && <TypingIndicator />}

        {/* Suggested prompts */}
        {showSuggestions && messages.length <= 1 && !loading && (
          <View style={s.suggestions}>
            <Text style={s.suggestTitle}>Ask me anything ✦</Text>
            {SUGGESTED_PROMPTS.map((p, i) => (
              <Pressable key={i} onPress={() => sendMsg(p)} style={({ pressed }) => [s.suggestChip, pressed && { opacity:0.7 }]}>
                <Text style={s.suggestText}>{p}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[s.inputWrap, { paddingBottom: insets.bottom + 12 }]}>
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Ask the stars..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMsg(input)}
          />
          <Pressable
            onPress={() => sendMsg(input)}
            disabled={loading || !input.trim()}
            style={({ pressed }) => [s.sendBtn, (!input.trim() || loading) && { opacity:0.4 }, pressed && { opacity:0.8 }]}
          >
            <LinearGradient colors={['#a855f7','#7c3aed']} style={s.sendGrad}>
              {loading
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={s.sendIcon}>↑</Text>
              }
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

// Demo responses for when no API key is configured
function getDemoResponse(input: string, profile: UserProfile | null): string {
  const sign = profile?.sunSign ?? 'Aries'
  const moon  = profile?.moonSign ?? 'Libra'
  const lower = input.toLowerCase()

  if (lower.includes('sun') || lower.includes('sign')) {
    return `Your ${sign} Sun is the core of your identity — the conscious self you project into the world. As a ${sign}, you carry the energy of ${
      ['Aries','Leo','Sagittarius'].includes(sign) ? 'fire: passion, courage, and a need to inspire' :
      ['Taurus','Virgo','Capricorn'].includes(sign) ? 'earth: practicality, reliability, and the drive to build' :
      ['Gemini','Libra','Aquarius'].includes(sign) ? 'air: intellect, connection, and the gift of perspective' :
      'water: emotion, intuition, and deep empathy'
    }.\n\nThe Sun also represents your relationship with the masculine principle and authority figures. Understanding your Sun sign is the first chapter of your cosmic story.`
  }

  if (lower.includes('moon')) {
    return `Your Moon in ${moon} reveals your emotional interior — the private self, your instinctive reactions, and what makes you feel safe and nourished.\n\n${moon} Moon individuals tend to ${
      ['Aries','Leo','Sagittarius'].includes(moon) ? 'process emotions through action and movement. You need freedom to express what you feel.' :
      ['Taurus','Virgo','Capricorn'].includes(moon) ? 'seek emotional security through stability and routine. Comfort is sacred to you.' :
      ['Gemini','Libra','Aquarius'].includes(moon) ? 'intellectualize their feelings. You need to talk things through to understand them.' :
      'feel things deeply and intuitively. You have extraordinary emotional intelligence.'
    }\n\nThe Moon also governs your relationship with your mother and early home environment — themes worth exploring in your healing journey.`
  }

  if (lower.includes('career') || lower.includes('work') || lower.includes('job')) {
    return `For a ${sign}, the ideal career channels your natural gifts: ${
      ['Aries','Leo','Sagittarius'].includes(sign) ? 'leadership, creativity, and the freedom to take risks. Entrepreneurship, entertainment, or roles where you set the direction thrive.' :
      ['Taurus','Virgo','Capricorn'].includes(sign) ? 'building something lasting and tangible. Finance, architecture, medicine, or any craft-based field suits you.' :
      ['Gemini','Libra','Aquarius'].includes(sign) ? 'communication and ideas. Writing, law, design, technology, or advocacy channels your genius.' :
      'depth and service. Psychology, healing arts, research, or creative work that transforms others suits your nature.'
    }\n\nLook also to your 10th house sign in your natal chart — it reveals your public vocation and what you're meant to be recognized for.`
  }

  if (lower.includes('love') || lower.includes('relationship') || lower.includes('partner')) {
    return `In love, your ${sign} Sun seeks a partner who can ${
      ['Aries','Leo','Sagittarius'].includes(sign) ? 'match your energy and celebrate your individuality — never dim your fire.' :
      ['Taurus','Virgo','Capricorn'].includes(sign) ? 'offer loyalty, stability, and depth — someone who shows love through actions, not just words.' :
      ['Gemini','Libra','Aquarius'].includes(sign) ? 'stimulate your mind and honor your need for space and independence.' :
      'hold emotional depth with you — someone safe enough for you to be truly vulnerable.'
    }\n\nYour ${moon} Moon adds another layer: emotionally, you need ${
      ['Cancer','Pisces','Scorpio'].includes(moon) ? 'profound intimacy and the sense of being truly seen and understood.' :
      ['Gemini','Aquarius','Libra'].includes(moon) ? 'mental connection and independence within the relationship.' :
      'reliability and grounded affection — love expressed through consistent presence.'
    }`
  }

  return `The cosmos are always in motion, and so are you, dear ${sign}. ✦\n\nThe current planetary weather invites you to reflect on what you're building versus what you're clinging to. Saturn asks for structure; Jupiter expands what you feed it; and the Moon tonight calls you toward authentic feeling over performed composure.\n\nWhat specific area of your life are you seeking clarity on? I can give you a much more focused reading.`
}

const s = StyleSheet.create({
  headerGrad: { paddingHorizontal:20, paddingBottom:16 },
  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  agentCard: { flexDirection:'row', alignItems:'center', gap:12 },
  agentAvatar: { width:42, height:42, borderRadius:999, alignItems:'center', justifyContent:'center' },
  agentAvatarText: { fontSize:20 },
  agentName: { color:'#fff', fontSize:16, fontWeight:'800' },
  onlineRow: { flexDirection:'row', alignItems:'center', gap:5, marginTop:2 },
  onlineDot: { width:6, height:6, borderRadius:3, backgroundColor:'#4ade80' },
  onlineText: { color: TEXT_SECONDARY, fontSize:11.5 },
  chartBadge: { backgroundColor:'rgba(168,85,247,0.15)', borderWidth:1, borderColor:'rgba(168,85,247,0.3)', borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  chartBadgeText: { color: ACCENT, fontSize:12, fontWeight:'700' },
  suggestions: { paddingHorizontal:16, paddingTop:8 },
  suggestTitle: { color: TEXT_SECONDARY, fontSize:13, fontWeight:'600', marginBottom:10, textAlign:'center' },
  suggestChip: { backgroundColor: SURFACE, borderWidth:1, borderColor: BORDER, borderRadius:14, padding:14, marginBottom:8 },
  suggestText: { color: TEXT_SECONDARY, fontSize:13.5, lineHeight:20 },
  inputWrap: { paddingHorizontal:16, paddingTop:8, borderTopWidth:1, borderTopColor: BORDER, backgroundColor: BG },
  inputRow: { flexDirection:'row', alignItems:'flex-end', gap:10 },
  input: {
    flex:1,
    backgroundColor: SURFACE,
    borderWidth:1, borderColor: BORDER,
    borderRadius:20, paddingHorizontal:16, paddingVertical:12,
    color:'#fff', fontSize:15, maxHeight:120,
  },
  sendBtn: { borderRadius:999, overflow:'hidden' },
  sendGrad: { width:46, height:46, borderRadius:999, alignItems:'center', justifyContent:'center' },
  sendIcon: { color:'#fff', fontSize:20, fontWeight:'800' },
})
