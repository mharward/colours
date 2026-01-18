import { parse, formatHex, formatHex8, formatRgb, formatHsl, Color } from 'culori'
import { ColourFormats, ParsedColour, ValidParsedColour } from '../types'

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
