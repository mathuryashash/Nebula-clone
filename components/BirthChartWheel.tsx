/**
 * SVG Birth Chart Wheel
 * Draws the zodiac wheel with planets positioned at their actual longitudes.
 */
import React from 'react'
import Svg, { Circle, Line, Text as SvgText, G, Path, Defs, LinearGradient as SvgGrad, Stop } from 'react-native-svg'
import type { BirthChart } from '@/lib/astrology'
import { SIGN_META } from '@/lib/astrology'
import { ACCENT } from '@/lib/theme'

interface Props {
  chart: BirthChart
  size?: number
}

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'] as const

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#f97316', Earth: '#84cc16', Air: '#38bdf8', Water: '#818cf8',
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function BirthChartWheel({ chart, size = 320 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 8

  const outerR = R             // zodiac band outer
  const innerR = R * 0.78      // zodiac band inner / house outer
  const houseR = R * 0.54      // house inner boundary
  const planetR = R * 0.65     // planet placement radius
  const labelR  = R * 0.88     // zodiac glyph radius

  // Ascendant is at the left (180° in our coordinate system = 0° chart)
  const ascOffset = SIGNS.indexOf(chart.risingSign) * 30

  function chartToAngle(lon: number) {
    // lon=0 is Aries. Ascendant points to the left (180°).
    return ((lon - ascOffset + 180) % 360 + 360) % 360
  }

  // Build planet positions with collision avoidance
  const planets = chart.planets.slice(0, 10).map(p => {
    const signIdx = SIGNS.indexOf(p.sign as any)
    const lon = signIdx * 30 + p.degree
    const angle = chartToAngle(lon)
    return { ...p, angle, lon }
  })

  // Simple collision offset for overlapping planets
  const adjustedAngles: number[] = planets.map(p => p.angle)
  for (let i = 0; i < adjustedAngles.length; i++) {
    for (let j = i + 1; j < adjustedAngles.length; j++) {
      let diff = adjustedAngles[j] - adjustedAngles[i]
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      if (Math.abs(diff) < 10) {
        adjustedAngles[i] -= 5
        adjustedAngles[j] += 5
      }
    }
  }

  return (
    <Svg width={size} height={size}>
      <Defs>
        <SvgGrad id="chartBg" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1a0d3a" stopOpacity="1" />
          <Stop offset="1" stopColor="#0d0622" stopOpacity="1" />
        </SvgGrad>
        <SvgGrad id="accentGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#a855f7" stopOpacity="1" />
          <Stop offset="1" stopColor="#7c3aed" stopOpacity="1" />
        </SvgGrad>
      </Defs>

      {/* Background */}
      <Circle cx={cx} cy={cy} r={R} fill="url(#chartBg)" />
      <Circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1.5" />

      {/* Zodiac band segments */}
      {SIGNS.map((sign, i) => {
        const startAngle = i * 30 - 90 - ascOffset
        const endAngle   = startAngle + 30
        const midAngle   = startAngle + 15
        const meta = SIGN_META[sign]
        const elemColor = ELEMENT_COLORS[meta.element]

        const s1 = polarToXY(cx, cy, innerR, startAngle)
        const s2 = polarToXY(cx, cy, outerR, startAngle)
        const e1 = polarToXY(cx, cy, innerR, endAngle)
        const e2 = polarToXY(cx, cy, outerR, endAngle)
        const lp = polarToXY(cx, cy, labelR, midAngle)

        const rad1 = (startAngle) * (Math.PI / 180)
        const rad2 = (endAngle) * (Math.PI / 180)

        // Segment arc path
        const d = [
          `M ${cx + innerR * Math.cos(rad1)} ${cy + innerR * Math.sin(rad1)}`,
          `L ${cx + outerR * Math.cos(rad1)} ${cy + outerR * Math.sin(rad1)}`,
          `A ${outerR} ${outerR} 0 0 1 ${cx + outerR * Math.cos(rad2)} ${cy + outerR * Math.sin(rad2)}`,
          `L ${cx + innerR * Math.cos(rad2)} ${cy + innerR * Math.sin(rad2)}`,
          `A ${innerR} ${innerR} 0 0 0 ${cx + innerR * Math.cos(rad1)} ${cy + innerR * Math.sin(rad1)}`,
          'Z',
        ].join(' ')

        return (
          <G key={sign}>
            <Path d={d} fill={elemColor + '14'} stroke={elemColor + '30'} strokeWidth="0.5" />
            <SvgText
              x={lp.x} y={lp.y}
              fill={elemColor}
              fontSize={size * 0.038}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontWeight="bold"
            >
              {meta.symbol}
            </SvgText>
          </G>
        )
      })}

      {/* House division lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * 30 - ascOffset
        const inner = polarToXY(cx, cy, houseR, angle - 90)
        const outer = polarToXY(cx, cy, innerR, angle - 90)
        const isAxis = i % 3 === 0
        return (
          <Line
            key={i}
            x1={inner.x} y1={inner.y}
            x2={outer.x} y2={outer.y}
            stroke={isAxis ? 'rgba(168,85,247,0.55)' : 'rgba(255,255,255,0.12)'}
            strokeWidth={isAxis ? 1.5 : 0.7}
          />
        )
      })}

      {/* House numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 + 15 - ascOffset) - 90
        const p = polarToXY(cx, cy, (houseR + innerR) / 2, angle)
        return (
          <SvgText
            key={i}
            x={p.x} y={p.y}
            fill="rgba(255,255,255,0.2)"
            fontSize={size * 0.028}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {i + 1}
          </SvgText>
        )
      })}

      {/* Inner circle */}
      <Circle cx={cx} cy={cy} r={houseR} fill="rgba(8,6,18,0.6)" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />

      {/* Aspect lines (major aspects between inner planets) */}
      {planets.slice(0, 7).map((p1, i) =>
        planets.slice(i + 1, 7).map((p2, j) => {
          let diff = Math.abs(p1.lon - p2.lon)
          if (diff > 180) diff = 360 - diff
          const isConj = diff < 10
          const isTrine = Math.abs(diff - 120) < 8
          const isSquare = Math.abs(diff - 90) < 8
          const isSextile = Math.abs(diff - 60) < 6
          const isOpposition = Math.abs(diff - 180) < 8

          if (!isConj && !isTrine && !isSquare && !isSextile && !isOpposition) return null

          const color = isTrine || isSextile ? 'rgba(74,222,128,0.22)' :
                        isConj ? 'rgba(168,85,247,0.25)' :
                        'rgba(248,113,113,0.18)'

          const a1 = (adjustedAngles[i] - 90) * Math.PI / 180
          const a2 = (adjustedAngles[planets.slice(0, 7).indexOf(p2)] - 90) * Math.PI / 180
          const x1 = cx + houseR * 0.85 * Math.cos(a1)
          const y1 = cy + houseR * 0.85 * Math.sin(a1)
          const x2 = cx + houseR * 0.85 * Math.cos(a2)
          const y2 = cy + houseR * 0.85 * Math.sin(a2)

          return (
            <Line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color} strokeWidth="0.8" />
          )
        })
      )}

      {/* Planet symbols */}
      {planets.map((p, i) => {
        const angle = adjustedAngles[i]
        const pos = polarToXY(cx, cy, planetR, angle - 90)
        const meta = SIGN_META[p.sign]
        const elemColor = ELEMENT_COLORS[meta.element]
        return (
          <G key={p.planet}>
            <Circle cx={pos.x} cy={pos.y} r={size * 0.032} fill={elemColor + '22'} stroke={elemColor + '55'} strokeWidth="1" />
            <SvgText
              x={pos.x} y={pos.y}
              fill={elemColor}
              fontSize={size * 0.035}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontWeight="bold"
            >
              {p.glyph}
            </SvgText>
            {p.retrograde && (
              <SvgText
                x={pos.x + size * 0.024} y={pos.y - size * 0.022}
                fill="rgba(248,113,113,0.9)"
                fontSize={size * 0.022}
                textAnchor="middle"
              >
                Rx
              </SvgText>
            )}
          </G>
        )
      })}

      {/* Center */}
      <Circle cx={cx} cy={cy} r={size * 0.055} fill="url(#accentBg)" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
      <SvgText
        x={cx} y={cy}
        fill="#a855f7"
        fontSize={size * 0.045}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        ☽
      </SvgText>

      {/* Ascendant / Descendant axis markers */}
      <SvgText
        x={size * 0.04} y={cy + 4}
        fill="rgba(168,85,247,0.8)"
        fontSize={size * 0.030}
        fontWeight="bold"
      >
        ASC
      </SvgText>
      <SvgText
        x={size * 0.87} y={cy + 4}
        fill="rgba(168,85,247,0.5)"
        fontSize={size * 0.026}
      >
        DSC
      </SvgText>
    </Svg>
  )
}
