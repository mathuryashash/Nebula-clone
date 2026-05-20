/**
 * 🌟 Nebula Astrology Engine
 * Simplified but visually accurate planetary calculations.
 */

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces'

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water'
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable'
export type Planet = 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
export type House = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface BirthData {
  year: number
  month: number   // 1–12
  day: number
  hour: number    // 0–23
  minute: number
  lat: number     // latitude
  lng: number     // longitude
  timezone: number // UTC offset hours
}

export interface PlanetPosition {
  planet: Planet
  sign: ZodiacSign
  degree: number   // 0–29
  house: House
  retrograde: boolean
  glyph: string
}

export interface BirthChart {
  sunSign: ZodiacSign
  moonSign: ZodiacSign
  risingSign: ZodiacSign
  planets: PlanetPosition[]
  houses: { house: House; sign: ZodiacSign; degree: number }[]
  dominantElement: Element
  dominantModality: Modality
}

// ── Sign metadata ─────────────────────────────────────────────────────────────

export const SIGN_META: Record<ZodiacSign, {
  symbol: string; glyph: string; element: Element; modality: Modality;
  ruling: Planet; color: string; dates: string;
  traits: string[]; keywords: string[];
}> = {
  Aries:       { symbol:'♈', glyph:'♈', element:'Fire',  modality:'Cardinal', ruling:'Mars',    color:'#f97316', dates:'Mar 21 – Apr 19', traits:['Bold','Passionate','Impulsive'], keywords:['initiative','courage','action'] },
  Taurus:      { symbol:'♉', glyph:'♉', element:'Earth', modality:'Fixed',    ruling:'Venus',   color:'#84cc16', dates:'Apr 20 – May 20', traits:['Reliable','Patient','Stubborn'], keywords:['stability','beauty','pleasure'] },
  Gemini:      { symbol:'♊', glyph:'♊', element:'Air',   modality:'Mutable',  ruling:'Mercury', color:'#facc15', dates:'May 21 – Jun 20', traits:['Curious','Witty','Restless'],  keywords:['communication','duality','wit'] },
  Cancer:      { symbol:'♋', glyph:'♋', element:'Water', modality:'Cardinal', ruling:'Moon',    color:'#818cf8', dates:'Jun 21 – Jul 22', traits:['Nurturing','Intuitive','Moody'], keywords:['home','emotion','memory'] },
  Leo:         { symbol:'♌', glyph:'♌', element:'Fire',  modality:'Fixed',    ruling:'Sun',     color:'#f59e0b', dates:'Jul 23 – Aug 22', traits:['Confident','Creative','Dramatic'], keywords:['self-expression','leadership','creativity'] },
  Virgo:       { symbol:'♍', glyph:'♍', element:'Earth', modality:'Mutable',  ruling:'Mercury', color:'#6ee7b7', dates:'Aug 23 – Sep 22', traits:['Analytical','Helpful','Critical'], keywords:['service','health','precision'] },
  Libra:       { symbol:'♎', glyph:'♎', element:'Air',   modality:'Cardinal', ruling:'Venus',   color:'#f9a8d4', dates:'Sep 23 – Oct 22', traits:['Diplomatic','Fair','Indecisive'], keywords:['balance','harmony','relationships'] },
  Scorpio:     { symbol:'♏', glyph:'♏', element:'Water', modality:'Fixed',    ruling:'Mars',    color:'#c084fc', dates:'Oct 23 – Nov 21', traits:['Intense','Magnetic','Secretive'], keywords:['transformation','power','depth'] },
  Sagittarius: { symbol:'♐', glyph:'♐', element:'Fire',  modality:'Mutable',  ruling:'Jupiter', color:'#fb923c', dates:'Nov 22 – Dec 21', traits:['Adventurous','Optimistic','Blunt'], keywords:['freedom','philosophy','adventure'] },
  Capricorn:   { symbol:'♑', glyph:'♑', element:'Earth', modality:'Cardinal', ruling:'Saturn',  color:'#94a3b8', dates:'Dec 22 – Jan 19', traits:['Ambitious','Disciplined','Reserved'], keywords:['ambition','structure','achievement'] },
  Aquarius:    { symbol:'♒', glyph:'♒', element:'Air',   modality:'Fixed',    ruling:'Saturn',  color:'#38bdf8', dates:'Jan 20 – Feb 18', traits:['Innovative','Humanitarian','Detached'], keywords:['revolution','community','vision'] },
  Pisces:      { symbol:'♓', glyph:'♓', element:'Water', modality:'Mutable',  ruling:'Jupiter', color:'#a78bfa', dates:'Feb 19 – Mar 20', traits:['Compassionate','Artistic','Escapist'], keywords:['dreams','compassion','spirituality'] },
}

export const PLANET_GLYPHS: Record<Planet, string> = {
  Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
}

// ── Sun sign ──────────────────────────────────────────────────────────────────

const SUN_SIGN_RANGES: { sign: ZodiacSign; start: [number,number]; end: [number,number] }[] = [
  { sign:'Aries',       start:[3,21],  end:[4,19]  },
  { sign:'Taurus',      start:[4,20],  end:[5,20]  },
  { sign:'Gemini',      start:[5,21],  end:[6,20]  },
  { sign:'Cancer',      start:[6,21],  end:[7,22]  },
  { sign:'Leo',         start:[7,23],  end:[8,22]  },
  { sign:'Virgo',       start:[8,23],  end:[9,22]  },
  { sign:'Libra',       start:[9,23],  end:[10,22] },
  { sign:'Scorpio',     start:[10,23], end:[11,21] },
  { sign:'Sagittarius', start:[11,22], end:[12,21] },
  { sign:'Capricorn',   start:[12,22], end:[1,19]  },
  { sign:'Aquarius',    start:[1,20],  end:[2,18]  },
  { sign:'Pisces',      start:[2,19],  end:[3,20]  },
]

export function getSunSign(month: number, day: number): ZodiacSign {
  for (const r of SUN_SIGN_RANGES) {
    if (r.sign === 'Capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn'
      continue
    }
    const [sm, sd] = r.start
    const [em, ed] = r.end
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return r.sign
  }
  return 'Capricorn'
}

// ── Julian Day ────────────────────────────────────────────────────────────────

function toJD(year: number, month: number, day: number, hour = 12): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  return jdn + (hour - 12) / 24
}

// ── Moon sign (simplified Meeus algorithm) ────────────────────────────────────

export function getMoonSign(year: number, month: number, day: number, hour = 12): ZodiacSign {
  const jd = toJD(year, month, day, hour)
  // Mean lunar longitude (degrees)
  const T = (jd - 2451545.0) / 36525
  let L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841
  L = ((L % 360) + 360) % 360
  const idx = Math.floor(L / 30) % 12
  const signs: ZodiacSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  return signs[idx]
}

// ── Rising sign (Ascendant) ────────────────────────────────────────────────────

export function getRisingSign(
  year: number, month: number, day: number,
  hour: number, minute: number,
  lat: number, lng: number, timezone: number
): ZodiacSign {
  const utcHour = hour + minute / 60 - timezone
  const jd = toJD(year, month, day, utcHour)
  const T = (jd - 2451545.0) / 36525
  // Local Sidereal Time
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - T * T * T / 38710000
  GMST = ((GMST % 360) + 360) % 360
  const LST = ((GMST + lng) % 360 + 360) % 360
  // Obliquity of ecliptic
  const eps = (23.439291111 - 0.013004167 * T) * (Math.PI / 180)
  // Ascendant longitude
  const lstr = LST * (Math.PI / 180)
  const latr = lat * (Math.PI / 180)
  let asc = Math.atan2(Math.cos(lstr), -(Math.sin(lstr) * Math.cos(eps) + Math.tan(latr) * Math.sin(eps)))
  asc = ((asc * (180 / Math.PI)) + 360) % 360
  const idx = Math.floor(asc / 30) % 12
  const signs: ZodiacSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  return signs[idx]
}

// ── Planet positions (simplified orbital elements) ────────────────────────────

function planetLongitude(planet: Planet, jd: number): number {
  const T = (jd - 2451545.0) / 36525

  const elements: Record<Planet, [number, number]> = {
    Sun:     [280.46646 + 36000.76983 * T,    0],
    Moon:    [218.3164477 + 481267.88123421 * T, 0],
    Mercury: [252.2503235 + 149472.6746358 * T, 0],
    Venus:   [181.9797959 + 58517.8156760 * T,  0],
    Mars:    [355.4333275 + 19140.2993313 * T,  0],
    Jupiter: [34.3514316 + 3034.9056606 * T,    0],
    Saturn:  [50.0774443 + 1222.1138488 * T,    0],
    Uranus:  [314.0550699 + 428.4669983 * T,    0],
    Neptune: [304.3486207 + 218.4862002 * T,    0],
    Pluto:   [238.9508462 + 144.9609983 * T,    0],
  }

  const [L] = elements[planet]
  return ((L % 360) + 360) % 360
}

function longitudeToSign(lon: number): { sign: ZodiacSign; degree: number } {
  const signs: ZodiacSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  const idx = Math.floor(lon / 30) % 12
  return { sign: signs[idx], degree: Math.floor(lon % 30) }
}

// Simple retrograde check (when planet's daily motion is negative compared to previous day)
function isRetrograde(planet: Planet, jd: number): boolean {
  if (planet === 'Sun' || planet === 'Moon') return false
  const lon1 = planetLongitude(planet, jd - 1)
  const lon2 = planetLongitude(planet, jd)
  let diff = lon2 - lon1
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  return diff < 0
}

// ── Full birth chart ──────────────────────────────────────────────────────────

export function calculateBirthChart(data: BirthData): BirthChart {
  const { year, month, day, hour, minute, lat, lng, timezone } = data
  const utcHour = hour + minute / 60 - timezone
  const jd = toJD(year, month, day, utcHour)

  const sunSign     = getSunSign(month, day)
  const moonSign    = getMoonSign(year, month, day, utcHour)
  const risingSign  = getRisingSign(year, month, day, hour, minute, lat, lng, timezone)

  const risingLon = (() => {
    const signs: ZodiacSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
    return signs.indexOf(risingSign) * 30
  })()

  const PLANETS: Planet[] = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']

  const planets: PlanetPosition[] = PLANETS.map(planet => {
    const lon = planetLongitude(planet, jd)
    const { sign, degree } = longitudeToSign(lon)
    // House = which 30° segment counting from Ascendant
    let relLon = ((lon - risingLon) % 360 + 360) % 360
    const house = (Math.floor(relLon / 30) + 1) as House
    return {
      planet,
      sign,
      degree,
      house: Math.min(house, 12) as House,
      retrograde: isRetrograde(planet, jd),
      glyph: PLANET_GLYPHS[planet],
    }
  })

  // Houses (equal house system from Ascendant)
  const signs: ZodiacSign[] = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
  const houses = Array.from({ length: 12 }, (_, i) => {
    const lon = (risingLon + i * 30) % 360
    const idx = Math.floor(lon / 30) % 12
    return { house: (i + 1) as House, sign: signs[idx], degree: Math.floor(lon % 30) }
  })

  // Dominant element
  const elementCount: Record<Element, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 }
  planets.slice(0, 7).forEach(p => {
    elementCount[SIGN_META[p.sign].element]++
  })
  const dominantElement = (Object.keys(elementCount) as Element[]).reduce((a, b) =>
    elementCount[a] >= elementCount[b] ? a : b)

  // Dominant modality
  const modalityCount: Record<Modality, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 }
  planets.slice(0, 7).forEach(p => {
    modalityCount[SIGN_META[p.sign].modality]++
  })
  const dominantModality = (Object.keys(modalityCount) as Modality[]).reduce((a, b) =>
    modalityCount[a] >= modalityCount[b] ? a : b)

  return { sunSign, moonSign, risingSign, planets, houses, dominantElement, dominantModality }
}

// ── Compatibility ─────────────────────────────────────────────────────────────

export interface CompatibilityResult {
  overall: number       // 0–100
  love: number
  communication: number
  values: number
  passion: number
  summary: string
  strengths: string[]
  challenges: string[]
}

export function calculateCompatibility(
  sunA: ZodiacSign, moonA: ZodiacSign,
  sunB: ZodiacSign, moonB: ZodiacSign
): CompatibilityResult {
  const elemA = SIGN_META[sunA].element
  const elemB = SIGN_META[sunB].element
  const modA  = SIGN_META[sunA].modality
  const modB  = SIGN_META[sunB].modality

  // Element compatibility
  const elemScore = (() => {
    if (elemA === elemB) return 90
    const compatible: Record<Element, Element[]> = {
      Fire: ['Air'], Air: ['Fire'], Earth: ['Water'], Water: ['Earth'],
    }
    if (compatible[elemA]?.includes(elemB)) return 78
    return 52
  })()

  // Modality compatibility
  const modScore = (() => {
    if (modA === modB) return 70
    if ((modA === 'Cardinal' && modB === 'Fixed') || (modA === 'Fixed' && modB === 'Cardinal')) return 65
    return 80
  })()

  // Moon sign harmony
  const moonElemA = SIGN_META[moonA].element
  const moonElemB = SIGN_META[moonB].element
  const moonScore = moonElemA === moonElemB ? 88 : (
    ['Fire','Air'].includes(moonElemA) && ['Fire','Air'].includes(moonElemB) ? 75 :
    ['Earth','Water'].includes(moonElemA) && ['Earth','Water'].includes(moonElemB) ? 75 : 55
  )

  const love          = Math.round((elemScore * 0.5 + moonScore * 0.5))
  const communication = Math.round((elemScore * 0.3 + modScore * 0.7))
  const values        = Math.round((elemScore * 0.6 + modScore * 0.4))
  const passion       = Math.round((elemScore * 0.7 + moonScore * 0.3))
  const overall       = Math.round((love + communication + values + passion) / 4)

  const summaries: Record<string, string> = {
    high: `${sunA} and ${sunB} share a deep cosmic connection. Your elements harmonize naturally, creating a partnership that feels both exciting and stable.`,
    mid: `${sunA} and ${sunB} bring different energies that can complement each other beautifully when you lean into your differences rather than against them.`,
    low: `${sunA} and ${sunB} face genuine challenges, but the stars don't determine destiny. Awareness of your differences is the first step to bridging them.`,
  }
  const summary = overall >= 75 ? summaries.high : overall >= 55 ? summaries.mid : summaries.low

  return {
    overall, love, communication, values, passion, summary,
    strengths: [
      `${SIGN_META[sunA].element} + ${SIGN_META[sunB].element} energy creates ${elemScore > 75 ? 'natural chemistry' : 'productive tension'}`,
      `Both value ${SIGN_META[sunA].keywords[0]} and ${SIGN_META[sunB].keywords[0]}`,
    ],
    challenges: [
      `${modA} vs ${modB} modality can cause pace differences`,
      `Emotional needs may require conscious attention`,
    ],
  }
}

// ── Moon phase ────────────────────────────────────────────────────────────────

export function getMoonPhase(date: Date): { name: string; emoji: string; illumination: number } {
  const jd = toJD(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const T = (jd - 2451545.0) / 36525
  // Mean anomaly of Sun
  const M  = ((357.52910 + 35999.05030 * T) % 360 + 360) % 360
  // Mean anomaly of Moon
  const Mm = ((134.96298 + 477198.86700 * T) % 360 + 360) % 360
  // Moon's argument of latitude
  const F  = ((93.27191 + 483202.01730 * T) % 360 + 360) % 360
  // Elongation
  const D  = ((297.85036 + 445267.11148 * T) % 360 + 360) % 360
  const phase = ((D % 360) + 360) % 360

  const phases = [
    { name: 'New Moon',        emoji: '🌑', min: 0,   max: 22.5  },
    { name: 'Waxing Crescent', emoji: '🌒', min: 22.5, max: 67.5 },
    { name: 'First Quarter',   emoji: '🌓', min: 67.5, max: 112.5 },
    { name: 'Waxing Gibbous',  emoji: '🌔', min: 112.5, max: 157.5 },
    { name: 'Full Moon',       emoji: '🌕', min: 157.5, max: 202.5 },
    { name: 'Waning Gibbous',  emoji: '🌖', min: 202.5, max: 247.5 },
    { name: 'Last Quarter',    emoji: '🌗', min: 247.5, max: 292.5 },
    { name: 'Waning Crescent', emoji: '🌘', min: 292.5, max: 360   },
  ]
  const p = phases.find(p => phase >= p.min && phase < p.max) ?? phases[0]
  const illumination = Math.round((1 - Math.cos(phase * Math.PI / 180)) / 2 * 100)
  return { ...p, illumination }
}
