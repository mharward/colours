import { parse, formatHex, formatHex8, formatRgb, formatHsl, Color } from 'culori'
import colorNamer from 'color-namer'
import { ColourFormats, ParsedColour, ValidParsedColour, ColourGroup, SavedColour } from '../types'

function formatRgba(color: Color): string {
  const rgb = formatRgb(color)
  const alpha = color.alpha ?? 1
  // Convert rgb(r, g, b) to rgba(r, g, b, a)
  return rgb.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
}

function formatHsla(color: Color): string {
  const hsl = formatHsl(color)
  const alpha = color.alpha ?? 1
  // Convert hsl(h, s%, l%) to hsla(h, s%, l%, a)
  return hsl.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`)
}

export function parseColour(input: string): ParsedColour {
  const trimmed = input.trim()

  if (!trimmed) {
    return { valid: false, formats: null, originalInput: '' }
  }

  const parsed = parse(trimmed)

  if (!parsed) {
    return { valid: false, formats: null, originalInput: trimmed }
  }

  const formats: ColourFormats = {
    hex: formatHex(parsed),
    hex8: formatHex8(parsed),
    rgb: formatRgb(parsed),
    rgba: formatRgba(parsed),
    hsl: formatHsl(parsed),
    hsla: formatHsla(parsed),
  }

  return { valid: true, formats, originalInput: trimmed }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function createGlowColour(rgba: string, opacity: number): string {
  return rgba.replace(/[\d.]+\)$/, `${opacity})`)
}

export function parseMultipleColours(input: string): ValidParsedColour[] {
  // Split on commas/newlines but not inside parentheses (for rgb/hsl values)
  const parts: string[] = []
  let current = ''
  let parenDepth = 0

  for (const char of input) {
    if (char === '(') {
      parenDepth++
      current += char
    } else if (char === ')') {
      parenDepth--
      current += char
    } else if ((char === ',' || char === '\n') && parenDepth === 0) {
      if (current.trim()) {
        parts.push(current.trim())
      }
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) {
    parts.push(current.trim())
  }

  const results: ValidParsedColour[] = []

  for (const part of parts) {
    const parsed = parseColour(part)
    if (parsed.valid && parsed.formats) {
      results.push({
        valid: true,
        formats: parsed.formats,
        originalInput: parsed.originalInput,
      })
    }
  }

  return results
}

export function generateColourName(hex: string): string {
  const names = colorNamer(hex)
  // Use ntc (Name That Color) for best results, fallback to basic
  const name = names.ntc?.[0]?.name || names.basic?.[0]?.name || 'Unknown'
  return name
}

export function extractColourMetrics(hsl: string): { hue: number; saturation: number; lightness: number } {
  // Parse hsl(h, s%, l%) format
  const match = hsl.match(/hsl\(\s*([\d.]+),?\s*([\d.]+)%?,?\s*([\d.]+)%?\)/)
  if (!match) {
    return { hue: 0, saturation: 0, lightness: 0 }
  }
  return {
    hue: parseFloat(match[1]),
    saturation: parseFloat(match[2]),
    lightness: parseFloat(match[3]),
  }
}

export function getColourGroup(hue: number, saturation: number, lightness: number): ColourGroup {
  // Check for neutrals first
  if (saturation < 15 || lightness < 10 || lightness > 95) {
    return 'neutral'
  }

  // Normalize hue to 0-360
  const h = ((hue % 360) + 360) % 360

  // Determine colour group based on hue ranges
  if (h >= 345 || h < 15) return 'red'
  if (h >= 15 && h < 45) return 'orange'
  if (h >= 45 && h < 70) return 'yellow'
  if (h >= 70 && h < 165) return 'green'
  if (h >= 165 && h < 195) return 'cyan'
  if (h >= 195 && h < 260) return 'blue'
  if (h >= 260 && h < 290) return 'purple'
  if (h >= 290 && h < 345) return 'pink'

  return 'neutral'
}

export function groupColours(colours: SavedColour[]): Map<ColourGroup, SavedColour[]> {
  const groups = new Map<ColourGroup, SavedColour[]>()
  const groupOrder: ColourGroup[] = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink', 'neutral']

  // Initialize all groups
  for (const group of groupOrder) {
    groups.set(group, [])
  }

  // Sort colours into groups
  for (const colour of colours) {
    const group = getColourGroup(colour.hue, colour.saturation, colour.lightness)
    groups.get(group)!.push(colour)
  }

  // Remove empty groups
  for (const group of groupOrder) {
    if (groups.get(group)!.length === 0) {
      groups.delete(group)
    }
  }

  return groups
}

export function getDisplayName(colour: SavedColour): string {
  return colour.customName ?? colour.autoName
}

export function getGroupLabel(group: ColourGroup): string {
  const labels: Record<ColourGroup, string> = {
    red: 'Reds',
    orange: 'Oranges',
    yellow: 'Yellows',
    green: 'Greens',
    cyan: 'Cyans',
    blue: 'Blues',
    purple: 'Purples',
    pink: 'Pinks',
    neutral: 'Neutrals',
  }
  return labels[group]
}
