import { parse, formatHex, formatHex8, formatRgb, formatHsl, Color } from 'culori'

export interface ColourFormats {
  hex: string
  hex8: string
  rgb: string
  rgba: string
  hsl: string
  hsla: string
}

export interface ParsedColour {
  valid: boolean
  formats: ColourFormats | null
  alpha: number
}

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
    return { valid: false, formats: null, alpha: 1 }
  }

  const parsed = parse(trimmed)

  if (!parsed) {
    return { valid: false, formats: null, alpha: 1 }
  }

  const alpha = parsed.alpha ?? 1

  const formats: ColourFormats = {
    hex: formatHex(parsed),
    hex8: formatHex8(parsed),
    rgb: formatRgb(parsed),
    rgba: formatRgba(parsed),
    hsl: formatHsl(parsed),
    hsla: formatHsla(parsed),
  }

  return { valid: true, formats, alpha }
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
