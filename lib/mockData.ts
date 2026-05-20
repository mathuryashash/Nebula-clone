// Nebula mock data
export type ItemStatus = 'active' | 'inactive' | 'pending' | 'archived';
export interface ActivityItem { id: string; itemId: string; kind: string; title: string; detail: string; timeAgo: string; }
export interface ItemSummary { id: string; name: string; owner: string; status: ItemStatus; completion: number; health: number; activeUsers: number; updatedAt: string; summary: string; }
export interface TaskItem { id: string; itemId: string; title: string; state: string; priority: string; dueDate: string; }
export interface NotificationItem { id: string; title: string; message: string; read: boolean; body?: string; timeAgo?: string; }

export const activityItems: ActivityItem[] = [];
export const itemSummaries: ItemSummary[] = [];
export const taskItems: TaskItem[] = [];
export const notificationItems: NotificationItem[] = [];
export const demoUser = { id: '1', name: 'Demo User', fullName: 'Demo User', email: 'demo@example.com', initials: 'DU', sunSign: 'Aries', moonSign: 'Taurus', risingSign: 'Gemini' };

export const supportFaq: { id: string; q: string; a: string; question: string; answer: string }[] = [
  { id: '1', q: 'How are birth charts calculated?', a: 'Nebula uses your birth date...', question: 'How are birth charts calculated?', answer: 'Nebula uses your birth date, time, and location to calculate planetary positions using astronomical algorithms (simplified Meeus method), giving you accurate Sun, Moon, Rising, and planetary sign placements.' },
  { id: '2', q: 'How accurate is the AI astrologer?', a: 'The AI astrologer...', question: 'How accurate is the AI astrologer?', answer: 'The AI astrologer (powered by Groq/Llama) synthesizes traditional astrological wisdom with your personal birth chart. It\'s a tool for reflection and insight, not prediction.' },
  { id: '3', q: 'How is compatibility calculated?', a: 'Compatibility scores...', question: 'How is compatibility calculated?', answer: 'Compatibility scores analyze elemental harmony (Fire/Air, Earth/Water), modality dynamics (Cardinal/Fixed/Mutable), and Moon sign emotional compatibility between two charts.' },
  { id: '4', q: 'Is my birth data private?', a: 'Your birth data is...', question: 'Is my birth data private?', answer: 'Your birth data is stored only on your device using secure local storage. It is never sent to our servers without your explicit consent.' },
]
export const MOCK_PLANETS = []
export const MOCK_READINGS = []
