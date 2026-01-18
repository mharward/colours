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
  originalInput: string
}

export interface ValidParsedColour {
  valid: true
  formats: ColourFormats
  originalInput: string
}

export interface SavedColour {
  id: string
  originalInput: string
  formats: ColourFormats
}
