/**
 * Static horoscope content library.
 * Each sign has daily, weekly, and monthly readings.
 * Content rotates based on date seed for variety.
 */
import type { ZodiacSign } from './astrology'

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly'

interface Reading {
  overview: string
  love: string
  career: string
  wellness: string
  luckyNumber: number
  luckyColor: string
  affirmation: string
}

// Get a deterministic seed for rotation
function dateSeed(period: HoroscopePeriod): number {
  const now = new Date()
  if (period === 'daily')   return now.getFullYear() * 1000 + now.getMonth() * 31 + now.getDate()
  if (period === 'weekly')  return now.getFullYear() * 100 + Math.floor(now.getDate() / 7) + now.getMonth() * 5
  return now.getFullYear() * 12 + now.getMonth()
}

const CONTENT: Record<ZodiacSign, Record<HoroscopePeriod, Reading[]>> = {
  Aries: {
    daily: [
      {
        overview: "Mars ignites your ambitions today — a surge of electric energy has you ready to charge ahead. Don't second-guess your instincts; the cosmos is firmly on your side. However, watch for impulsiveness near midday when Mercury forms a tense angle.",
        love: "A spontaneous gesture speaks volumes. If you've been holding back feelings, today's fire energy invites bold honesty. Single Aries may encounter someone who matches their intensity.",
        career: "Your natural leadership shines in group settings. A bold proposal earns respect. Avoid power struggles — channel competitive energy into output, not office politics.",
        wellness: "High energy demands high-octane movement. Run, cycle, or hit the gym early. Your body wants to be pushed today, not coddled.",
        luckyNumber: 9, luckyColor: 'Crimson',
        affirmation: "I act with courage and trust my instincts completely.",
      },
      {
        overview: "The Sun trines your ruler Mars today, creating a rare window of clarity and momentum. Projects that stalled find new traction. You radiate confidence without even trying.",
        love: "Venus blesses your charisma. A flirtatious exchange could turn into something meaningful. For those partnered, deepen intimacy through shared adventure.",
        career: "Expect a breakthrough on a long-standing obstacle. Your directness cuts through bureaucracy. Pitch that idea — timing is excellent.",
        wellness: "Listen to your body's need for recovery as much as action. A power nap or mindful breathing restores your edge.",
        luckyNumber: 1, luckyColor: 'Scarlet',
        affirmation: "I am a force of nature moving in perfect direction.",
      },
    ],
    weekly: [
      {
        overview: "This week carries the energy of new beginnings. Mars in your sign amplifies your natural drive and magnetism. Mid-week brings a pivotal conversation — approach it with your signature directness but temper it with a dash of diplomacy.",
        love: "Romance is energized but volatile. Wednesday's Venus–Mars tension may create friction that, handled well, deepens attraction. Don't let pride get in the way of connection.",
        career: "A leadership opportunity presents itself by Thursday. Those in competitive fields may clinch a long-sought win. Keep documentation tight — details matter this week.",
        wellness: "Alternate between intense effort and genuine rest. Your adrenal system is working overtime. Prioritize sleep Sunday through Tuesday.",
        luckyNumber: 7, luckyColor: 'Orange',
        affirmation: "I channel my fire with purpose and precision.",
      },
    ],
    monthly: [
      {
        overview: "April finds Aries in peak personal power. The New Moon on the 8th in your sign is your annual reset button — set intentions that scare you a little. The full moon mid-month illuminates your relationship sector, asking you to balance self-focus with genuine partnership.",
        love: "Early month is electric for romance. A chance meeting has long-term potential. By the 20th, established relationships need quality time — book something special.",
        career: "The first two weeks are your window for bold moves. Launch, pitch, apply. After the 21st, shift to consolidation and deep work rather than new initiatives.",
        wellness: "Mars rules your physical vitality and this month it's generous. Try something new — rock climbing, martial arts, dance. Your body craves a fresh challenge.",
        luckyNumber: 3, luckyColor: 'Ruby',
        affirmation: "I am the spark that ignites great things.",
      },
    ],
  },
  Taurus: {
    daily: [
      {
        overview: "Venus, your ruler, stations direct today, lifting a fog that's lingered over your relationships and finances. Clarity arrives — and with it, a renewed sense of what you truly value. Don't rush; let the revelation settle before acting.",
        love: "A warm, steady energy fills your heart today. Someone from your past may resurface with genuine intent. Trust your instincts over your memories.",
        career: "Financial decisions look clearer than they have in weeks. A deal or negotiation turns in your favor. Your patience is finally paying compound interest.",
        wellness: "Treat your senses — a long bath, quality food, beautiful music. You recharge through pleasure, and today calls for deliberate indulgence.",
        luckyNumber: 6, luckyColor: 'Emerald',
        affirmation: "I trust the pace of my own unfolding.",
      },
    ],
    weekly: [
      {
        overview: "Taurus, this is a week of harvest. Seeds you planted in patience are beginning to break surface. Venus's favorable angle to Jupiter on Thursday brings unexpected good fortune — stay present so you don't miss it.",
        love: "Devotion deepens. A relationship conversation that felt stuck finds unexpected resolution. Singles: someone patient and reliable is worth a second look.",
        career: "Material gains are possible — a raise, client win, or financial windfall. Wednesday and Thursday are peak negotiation days. Stand firm on your worth.",
        wellness: "Your body is asking for grounding practices. Barefoot walks, earth tones, wholesome meals. Anxiety eases when you return to what's physically real.",
        luckyNumber: 4, luckyColor: 'Forest Green',
        affirmation: "I create abundance by valuing myself fully.",
      },
    ],
    monthly: [
      {
        overview: "May is Taurus season — your annual solar renewal. The Sun energizes your identity and visibility. Others see you at your best. The New Moon on the 7th asks: what do you want to build this year? Be specific and grounded.",
        love: "Venus in your sign until the 19th makes you irresistibly magnetic. Love blooms for those open to it. Existing partnerships reach new levels of tenderness and security.",
        career: "Your reputation grows. Promotions, recognition, and increased responsibility are all on the table. Say yes to visibility even when comfort calls for quiet.",
        wellness: "Spring energy supports new health routines. Find one sustainable habit and lock it in this month — your consistency will set the foundation for the year.",
        luckyNumber: 8, luckyColor: 'Jade',
        affirmation: "I build beautiful, lasting things — including myself.",
      },
    ],
  },
  Gemini: {
    daily: [
      {
        overview: "Mercury, your cosmic ruler, dances through your communication sector today with unusual grace. Words flow, ideas connect, and conversations that seemed dead suddenly come alive. A mental breakthrough is within reach — journal, brainstorm, or talk it through.",
        love: "Wit is your love language today. Light banter carries real depth. Don't mistake playfulness for superficiality — it's how you open up.",
        career: "Multitasking reaches new heights. You're everywhere at once, and somehow it works. A writing, speaking, or teaching project gets a boost.",
        wellness: "Your nervous system is humming. Ground yourself with a walk between tasks. Nature recalibrates the Gemini mind more effectively than screens.",
        luckyNumber: 5, luckyColor: 'Citrine Yellow',
        affirmation: "My mind is a gift — I use it to create and connect.",
      },
    ],
    weekly: [
      {
        overview: "Information flows into your life this week — some useful, some distracting. Practice discernment. The signal worth following appears Wednesday when Mercury makes an exact trine to your natal ruler. A conversation changes your perspective permanently.",
        love: "Playful energy masks genuine longing. Let your guard down with someone who's earned it. A text sent on impulse Thursday leads somewhere meaningful.",
        career: "Networking pays dividends. Reach out to three people you've meant to connect with. One of those conversations opens a significant door.",
        wellness: "Your breathing habits affect your anxiety more than you realize. Five minutes of slow breathing morning and evening transforms your week.",
        luckyNumber: 2, luckyColor: 'Topaz',
        affirmation: "I am both wind and anchor — curious and grounded.",
      },
    ],
    monthly: [
      {
        overview: "June marks Gemini's annual peak. Solar energy illuminates your unique gifts — your adaptability, your intelligence, your social grace. The Full Moon on the 11th in your opposite sign Sagittarius asks you to choose depth over breadth in at least one area of life.",
        love: "Gemini season brings romantic electricity. Your natural charm is at peak voltage. That said, avoid keeping too many options open — real intimacy needs commitment, even just of attention.",
        career: "A month of maximum intellectual output. Write, pitch, launch, network. Mercury's position suggests contracts signed before the 15th carry especially favorable terms.",
        wellness: "Shoulder and upper back tension signals mental overload. Regular movement breaks and less screen time will do more for your health than any supplement.",
        luckyNumber: 11, luckyColor: 'Amber',
        affirmation: "I honor both my many dimensions and my singular depth.",
      },
    ],
  },
  Cancer: {
    daily: [
      {
        overview: "The Moon, your celestial ruler, moves through Scorpio today, intensifying your emotional perceptiveness to near-psychic levels. You see beneath surfaces, sense unspoken truths, and feel others' moods as your own. Use this gift for healing — yours and others'.",
        love: "Emotional honesty unlocks a new level of intimacy today. What you're afraid to say may be exactly what's needed. Trust that vulnerability is strength.",
        career: "Your intuition about people and situations is uncannily accurate today. Trust the gut feeling about a colleague or project. You're reading the room better than anyone.",
        wellness: "Water is your medicine today — a long shower, swimming, even simply drinking more. Let water carry away what your empathic nature has absorbed.",
        luckyNumber: 2, luckyColor: 'Silver',
        affirmation: "I feel deeply and love fiercely — this is my superpower.",
      },
    ],
    weekly: [
      {
        overview: "Home and family matters take center stage this week. A domestic situation that needs tending calls your attention early. By mid-week, the emotional climate at work shifts — your nurturing instincts become a professional asset.",
        love: "Someone in your life shows up for you in an unexpected way. Let yourself receive care without deflecting. Vulnerability creates the intimacy you crave.",
        career: "Your ability to read emotional dynamics makes you invaluable in team settings this week. Trust your read on a colleague's true feelings about a project.",
        wellness: "Create a sanctuary moment each evening — even 15 minutes of solitude and candlelight resets your sensitive system.",
        luckyNumber: 7, luckyColor: 'Pearl',
        affirmation: "Home is not a place I find — it's a feeling I create.",
      },
    ],
    monthly: [
      {
        overview: "June/July activates your solar return — Cancer season is your cosmic new year. The Sun in your sign floods you with identity and visibility. It's time to be seen. The New Moon on the 17th in Cancer is the most powerful manifesting moment of your year.",
        love: "Emotional depth and romance intertwine beautifully. A relationship reaches a turning point — either towards greater commitment or honest release. Both outcomes serve your growth.",
        career: "Your nurturing reputation earns tangible rewards. A project you've tended with care finally produces visible results. Recognition arrives, sometimes unexpectedly.",
        wellness: "Your digestion and gut health deserve attention this month — they're reflecting emotional processing patterns. Simplify meals and slow down when eating.",
        luckyNumber: 6, luckyColor: 'Moonstone White',
        affirmation: "I am safe in my depths, and others are safe with me.",
      },
    ],
  },
  Leo: {
    daily: [
      {
        overview: "The Sun illuminates your natural stage today, Leo. Creative impulses are strong, and your ability to inspire others is at its peak. An audience — however small — rewards your authentic self-expression. Don't hide the light.",
        love: "Romance is your birthright today. Generous gestures, playful flirtation, and genuine admiration flow between you and someone special. Grand gestures aren't necessary — warmth and presence are enough.",
        career: "Leadership emerges organically. You don't need the title — your energy draws others to follow. A creative idea you've been sitting on deserves the spotlight.",
        wellness: "Your heart — literal and metaphorical — needs joyful exercise today. Dance, play, create. Whatever makes you feel fully alive counts as self-care.",
        luckyNumber: 1, luckyColor: 'Gold',
        affirmation: "I shine not to outshine others, but to light the way.",
      },
    ],
    weekly: [
      {
        overview: "This is a week of creative and romantic peak for Leo. The Sun's favorable angle to Jupiter mid-week expands your visibility in ways that feel almost magical. A recognition or opportunity arrives — accept it gracefully.",
        love: "Venus in your solar fifth house makes every interaction radiant. A new romance has storybook potential. Existing relationships reconnect over shared joy and creativity.",
        career: "Public-facing work pays off hugely. Give the presentation, post the content, take the stage. Your confidence is your most bankable asset this week.",
        wellness: "Stress relief through play is non-negotiable. Schedule at least one purely fun activity. Your inner child knows exactly what it needs.",
        luckyNumber: 8, luckyColor: 'Sunflower',
        affirmation: "I lead with heart, and others rise to meet me there.",
      },
    ],
    monthly: [
      {
        overview: "August is Leo's coronation. The Sun returns to your sign, marking your annual rebirth. The New Moon on the 4th sets intentions that will echo through the coming year — make them worthy of your lion heart.",
        love: "Love is dramatic, passionate, and life-altering. Whether single or partnered, this month holds romantic milestones. Accept that you deserve to be adored.",
        career: "The spotlight finds you whether you seek it or not. Embrace visibility. A passion project finds its audience. This is your moment — don't minimize it.",
        wellness: "Back and heart health deserve attention — literally and symbolically. Physical movement and emotional expression are equally healing this month.",
        luckyNumber: 5, luckyColor: 'Amber Gold',
        affirmation: "My authentic self is my greatest gift to the world.",
      },
    ],
  },
  Virgo: {
    daily: [
      {
        overview: "Mercury, your ruling planet, sharpens your analytical mind to a razor edge today. The details others overlook become your bread and butter. A problem that's stumped your team yields to your systematic approach. Your service is your greatest gift.",
        love: "Acts of service speak louder than words for you today. Fix something that needs fixing, remember something important, show up exactly when needed. Love is in the doing.",
        career: "Precision work gets finished and polished. A report, analysis, or process improvement earns genuine respect. Don't undersell your thoroughness — it creates real value.",
        wellness: "Gut health and digestion are asking for attention. Simplify your diet today, chew slowly, and notice what your body actually needs versus what habit demands.",
        luckyNumber: 5, luckyColor: 'Forest Green',
        affirmation: "My attention to detail creates beauty from chaos.",
      },
    ],
    weekly: [
      {
        overview: "Virgo, this week favors precision and service. A health or work routine benefits from a serious upgrade. Wednesday brings a breakthrough in a problem you've been quietly obsessing over — trust your process.",
        love: "Your critical eye softens mid-week when you notice someone's efforts more than their flaws. This shift opens genuine intimacy. You're allowed to be imperfect together.",
        career: "A project reaches a satisfying completion. Your thoroughness is recognized. New tasks arrive that suit your skill set perfectly — this is your work niche shining.",
        wellness: "Stress is living in your shoulders and jaw. A massage, yoga session, or even five minutes of shoulder rolls will release more tension than you expect.",
        luckyNumber: 3, luckyColor: 'Sage',
        affirmation: "I release perfectionism and welcome excellence.",
      },
    ],
    monthly: [
      {
        overview: "September is Virgo season — your annual solar peak. The Sun returns home, flooding you with energy, clarity, and purpose. This is your month to start that health plan, launch that project, and be discerning about what deserves your brilliant attention.",
        love: "Practicality and romance blend unusually well this month. A relationship that started as friendship reveals deeper dimensions. For partnered Virgos, shared goals become love language.",
        career: "Your reputation for reliability creates a significant opportunity. Mercury in your sign all month makes communication flawless — negotiate, write, present.",
        wellness: "Virgo rules the sixth house of health — this month, your body is responsive to change. One sustainable shift implemented now has outsized long-term impact.",
        luckyNumber: 6, luckyColor: 'Earthy Brown',
        affirmation: "I serve with love and honor myself in equal measure.",
      },
    ],
  },
  Libra: {
    daily: [
      {
        overview: "Venus graces your relationships with extra charm today, Libra. Social interactions carry magnetic quality, and your natural diplomacy smooths over even the thorniest friction. But don't avoid your own truth in the pursuit of peace — authentic harmony beats forced balance.",
        love: "Beautiful day for romance. Your aesthetic sense leads you to the perfect gesture, setting, or expression. Someone finds you completely irresistible today.",
        career: "Collaboration thrives. Your ability to find common ground between opposing viewpoints makes you invaluable in negotiations. Partnerships and joint ventures are favored.",
        wellness: "Beauty is wellness for Libra. Tend to your environment — a clean, aesthetically pleasing space calms your nervous system more than you realize.",
        luckyNumber: 6, luckyColor: 'Rose Pink',
        affirmation: "I choose harmony that honors both myself and others.",
      },
    ],
    weekly: [
      {
        overview: "Relationship themes dominate this week, Libra — both personal and professional. A partnership reaches a decision point: deepen or redefine. Thursday's Full Moon illuminates what's been unspoken. The conversation you've been avoiding is actually the one that will free you.",
        love: "Courage in love brings rewards this week. Say the thing you've been circling. The relationship can only go deeper if you risk the surface.",
        career: "A professional partnership negotiation requires your trademark fairness. Don't shortchange yourself in the name of keeping the peace. Your work has real worth.",
        wellness: "Balance — Libra's eternal theme — applies to rest versus activity this week. Your adrenals need rhythm, not extremes.",
        luckyNumber: 9, luckyColor: 'Lavender',
        affirmation: "I speak my truth with grace and invite truth in return.",
      },
    ],
    monthly: [
      {
        overview: "October brings Libra season and your annual solar renewal. The New Moon on the 2nd in your sign is your most powerful manifesting moment — set intentions for relationship, beauty, justice, and creative partnership. What do you want reflected back to you?",
        love: "Love is front and center all month. Venus in your sign amplifies your magnetism. A significant relationship development arrives around the 14th.",
        career: "Aesthetic and creative projects are your vehicle to recognition this month. Beauty is your business. Partnerships announced or formalized before the 20th carry lasting value.",
        wellness: "Kidney health and lower back are Libra's physical focus. Hydration, gentle movement, and reducing tension in relationships all serve your physical health directly.",
        luckyNumber: 7, luckyColor: 'Sky Blue',
        affirmation: "I am the balance I seek — whole within myself.",
      },
    ],
  },
  Scorpio: {
    daily: [
      {
        overview: "Pluto and Mars charge your senses today — you see through facades with x-ray precision, and your magnetic intensity draws people in whether you intend it or not. A revelation arrives in an unexpected place. Trust the depth, not the surface.",
        love: "Intensity becomes intimacy today. Someone you're close to wants to go deeper — meet them there. The soul-level connection you crave is available if you release control long enough to receive it.",
        career: "Your investigative instincts crack a problem that's stumped others. Strategic silence is your superpower today — listen far more than you speak.",
        wellness: "Release what's been festering below the surface. Journaling, therapy, a hard workout, or simply sitting with the feeling without acting on it — all are valid purges.",
        luckyNumber: 8, luckyColor: 'Deep Crimson',
        affirmation: "I transform what I face and emerge more powerful.",
      },
    ],
    weekly: [
      {
        overview: "Scorpio, this is a week of revelation and transformation. Something you suspected is confirmed by Wednesday. Rather than using the truth as a weapon, use it as a key. What it unlocks is far more valuable than vindication.",
        love: "Power dynamics in your relationships ask for conscious navigation. Lead with vulnerability rather than control. The risk feels massive; the reward is proportional.",
        career: "Financial insights and strategic moves are your superpowers this week. A joint resource or investment needs your Scorpionic discernment. Read every line.",
        wellness: "Emotional weight you've been carrying shows up physically. Your hips, back, and immune system are all asking for the same thing: release.",
        luckyNumber: 11, luckyColor: 'Obsidian',
        affirmation: "I release what no longer serves my evolution.",
      },
    ],
    monthly: [
      {
        overview: "November is Scorpio's annual resurrection. The Sun in your sign intensifies your presence and magnetism to near-legendary levels. The New Moon on the 1st opens a profound cycle of transformation — be willing to shed what's expired.",
        love: "Scorpio season intensifies every relationship. Bonds deepen or break — rarely anything in between. This month reveals who's truly in your corner.",
        career: "Your depth and strategic mind are unrivaled right now. Research, investigation, therapy, finance, crisis management — all Scorpionic domains — shine this month.",
        wellness: "Detox on every level: physical, emotional, digital, relational. What you release this month creates space for something extraordinary in December.",
        luckyNumber: 9, luckyColor: 'Midnight Black',
        affirmation: "Death and rebirth are my birthright — I welcome both.",
      },
    ],
  },
  Sagittarius: {
    daily: [
      {
        overview: "Jupiter expands your horizons today — literally or metaphorically. A foreign contact, philosophical conversation, or opportunity to learn something completely outside your expertise arrives. Say yes. The archer's strength is the willingness to aim beyond the visible.",
        love: "Freedom and romance coexist beautifully for you today. A spontaneous adventure with someone creates more connection than planned intimacy ever could. Be present to what unfolds.",
        career: "Big-picture thinking saves the day. While others are caught in details, you see the trajectory. A mentor or teacher figure offers invaluable perspective today.",
        wellness: "Get outside, move your body, breathe something that isn't recycled air. Sagittarius wilts indoors and blooms in motion and open space.",
        luckyNumber: 3, luckyColor: 'Purple',
        affirmation: "My optimism is not naïveté — it's faith in the possible.",
      },
    ],
    weekly: [
      {
        overview: "Jupiter's blessing is alive in your week, Sagittarius. A door opens that wasn't even a door before Wednesday. Travel, publishing, teaching, or philosophical breakthrough are all on the table. Don't shrink this opportunity to a manageable size.",
        love: "Adventure creates romance. Plan something that pushes both your edges. A partner who can match your enthusiasm and keep up with your truth-telling is worth their weight in gold.",
        career: "This is a week to think big and act boldly. A publishing, media, legal, or international matter moves decisively in your favor. Your vision is your asset.",
        wellness: "Hips and thighs are Sagittarius's physical domain — stretch them, strengthen them, honor them. Yoga, cycling, or hiking serve you perfectly this week.",
        luckyNumber: 12, luckyColor: 'Indigo',
        affirmation: "I aim for meaning, not just distance.",
      },
    ],
    monthly: [
      {
        overview: "December is Sagittarius season — the cosmos's annual celebration of truth, adventure, and expansion. The Sun in your sign amplifies your natural joy and magnetism. The New Moon on the 1st opens your most expansive cycle of the year.",
        love: "Love this month requires honesty above all. You can't pretend with your whole heart in your sign season — and that raw authenticity is irresistible to the right person.",
        career: "Publishing, teaching, international business, philosophy, law — all Sagittarian domains are illuminated. A project with global reach or ethical purpose comes to fruition.",
        wellness: "Your body wants movement and open space. Time in nature, especially high ground, recharges you like nothing else. Book at least one adventure this month.",
        luckyNumber: 9, luckyColor: 'Turquoise',
        affirmation: "My truth sets me — and others — free.",
      },
    ],
  },
  Capricorn: {
    daily: [
      {
        overview: "Saturn sharpens your focus today, and the mountain you're climbing suddenly has a visible summit. Practical steps taken now build foundations that outlast trends. Your discipline is your greatest wealth — apply it deliberately.",
        love: "Slow, steady, and serious — your love language is acts of commitment. Show up reliably today, and someone who matters will notice in a profound way.",
        career: "Authority figures recognize your competence today. A moment of recognition or advancement is possible. Present your work with quiet confidence — let the substance speak.",
        wellness: "Your knees, joints, and bones deserve attention — stretch, supplement, and rest properly. The Capricorn body is built for the long game, not just the sprint.",
        luckyNumber: 8, luckyColor: 'Charcoal',
        affirmation: "Every step I take builds an unshakeable foundation.",
      },
    ],
    weekly: [
      {
        overview: "This week rewards your patient investment, Capricorn. A career or financial matter that has required sustained effort finally produces visible results. Saturn's discipline and Jupiter's luck briefly align on Thursday — position yourself to receive the reward.",
        love: "Vulnerability is not weakness this week — it's your greatest act of courage. Letting someone see your softness beneath the mountain creates genuine intimacy.",
        career: "Executive presence is noted. A professional decision that seemed complex clarifies by Thursday. Your instinct about timing is correct — move when you feel ready, not when pressured.",
        wellness: "Rest is productive. The Capricorn tendency to push past depletion works against you this week. Treat sleep as a strategic investment, not indulgence.",
        luckyNumber: 4, luckyColor: 'Navy',
        affirmation: "I am patient with my becoming — greatness takes time.",
      },
    ],
    monthly: [
      {
        overview: "January marks Capricorn's solar peak and your annual CEO moment. The New Moon on the 1st — your sign's New Moon — is the most grounded, practical manifesting energy of the year. Set goals with structure, not just intention.",
        love: "Commitment themes arise. A relationship conversation about the future is honest and, ultimately, liberating. What you build together matters more than what you feel momentarily.",
        career: "Career peaks are possible. Public reputation, promotion, and professional legacy are all illuminated. The work you've done quietly announces itself loudly this month.",
        wellness: "January is your reset month — new routines locked in now carry all year. Build one physical practice and one mental practice that will hold.",
        luckyNumber: 10, luckyColor: 'Onyx',
        affirmation: "I build my empire one deliberate step at a time.",
      },
    ],
  },
  Aquarius: {
    daily: [
      {
        overview: "Uranus sends electric currents through your thinking today — breakthroughs and disruptions in equal measure. An unconventional solution to a persistent problem arrives out of nowhere. You're ahead of the curve; trust your weird, wonderful instincts.",
        love: "Authentic connection over conventional romance. Someone who meets your mind — truly meets it — is more intoxicating to you than any candle-lit dinner. Seek the spark of ideas.",
        career: "Innovation is your weapon today. Bring the idea that sounds crazy — it's the only one worth presenting. A group or community project gains real momentum.",
        wellness: "Circulation and nervous system need support. Alternating hot and cold in the shower, exercise that challenges your coordination, or breathwork all serve the Aquarian body.",
        luckyNumber: 11, luckyColor: 'Electric Blue',
        affirmation: "I am ahead of my time — and I'm okay with that.",
      },
    ],
    weekly: [
      {
        overview: "This is a breakthrough week for Aquarius. Uranus's electricity is at maximum charge by Wednesday, and what it disrupts was already overdue for change. A group, community, or technology-related project catapults forward.",
        love: "Intellectual chemistry becomes emotional depth this week. A mind that challenges yours is the greatest aphrodisiac. Let the unusual connection develop on its own terms.",
        career: "Innovation and the future are your career gifts this week. Pitch the idea. Start the platform. Join the movement. Your vision serves a purpose larger than yourself.",
        wellness: "Community and connection are medicine for Aquarius. Loneliness — even chosen solitude — needs balancing with genuine social nourishment this week.",
        luckyNumber: 7, luckyColor: 'Cyan',
        affirmation: "I think for humanity while honoring my individual truth.",
      },
    ],
    monthly: [
      {
        overview: "February is Aquarius season — the cosmos's annual celebration of innovation, community, and the future. The New Moon on the 9th in your sign opens your most electric cycle. What revolutionary idea or community have you been holding back?",
        love: "Friendship and romance blur in the most beautiful way. The best love story of your life may begin with intellectual respect. Be open to unconventional structures.",
        career: "Technology, social innovation, humanitarian work, and cutting-edge fields are your wheelhouse this month. A collaboration or community project reaches a meaningful milestone.",
        wellness: "Aquarius rules the ankles and circulation. Movement that is fluid and unconventional — dance, swimming, Pilates — serves you best. Rigid routines drain you; variety sustains.",
        luckyNumber: 4, luckyColor: 'Violet',
        affirmation: "My difference is my gift — I was made to disrupt.",
      },
    ],
  },
  Pisces: {
    daily: [
      {
        overview: "Neptune dissolves the boundaries between imagination and reality today — for Pisces, this is home territory. Creative and spiritual insights arrive unbidden. The challenge is to bridge the mystical to the practical without losing either.",
        love: "Soul-level connection is possible today. If you sense a spiritual or karmic bond with someone, trust it — but also stay grounded in observable behavior. Dreams and reality coexist.",
        career: "Artistic, therapeutic, spiritual, and imaginative work flows effortlessly. A creative project touches something true and resonant. Share it — others need what you can make.",
        wellness: "Water is your element and your medicine. A swim, a bath, time near the ocean or a river — any water connection recharges the Pisces soul profoundly.",
        luckyNumber: 7, luckyColor: 'Sea Green',
        affirmation: "I trust the current that carries me — it knows where I belong.",
      },
    ],
    weekly: [
      {
        overview: "Pisces, this week's Neptune transit opens your creative channels to full flow. A project, vision, or artistic work that's been gestating finally breaks surface. Don't overthink it — trust the dream and let others be moved by it.",
        love: "Spiritual connection and romance are inseparable this week. Pay attention to synchronicities — the universe is delivering messages through people. One of them deserves a real conversation.",
        career: "Creative, healing, spiritual, or compassionate work finds its audience this week. Don't hide your most sensitive work — it carries the most power.",
        wellness: "Boundaries are wellness for Pisces. Practice saying no once this week — not to be hard, but to preserve the soft center others are counting on.",
        luckyNumber: 12, luckyColor: 'Aquamarine',
        affirmation: "My sensitivity is sacred, not a flaw to overcome.",
      },
    ],
    monthly: [
      {
        overview: "March marks Pisces season — the zodiac's dreamtime, when imagination and spiritual depth are at their annual peak. The New Moon on the 10th in your sign opens the most poetic manifesting cycle of the year. Dream big and with feeling.",
        love: "The most romantic month of your year. A love that feels fated may arrive or deepen. Surrender is not defeat — it's how Pisces finds their true north.",
        career: "Creative, healing, and spiritual vocations find their peak expression. Your work touches hearts. A project or service with a compassionate mission gains traction and recognition.",
        wellness: "Sleep and dreamwork are literal medicine this month. Keep a dream journal — your unconscious is leaving breadcrumbs. Reduce alcohol and substances that cloud psychic clarity.",
        luckyNumber: 3, luckyColor: 'Lavender Mist',
        affirmation: "I am the ocean and the wave — boundless and beautiful.",
      },
    ],
  },
}

export function getReading(sign: ZodiacSign, period: HoroscopePeriod): Reading {
  const readings = CONTENT[sign]?.[period] ?? CONTENT['Aries'][period]
  const seed = dateSeed(period)
  const idx = seed % readings.length
  return readings[idx]
}

export { type Reading }
