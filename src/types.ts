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
  autoName: string
  customName?: string
  hue: number
  saturation: number
  lightness: number
}

export type ColourGroup =
  | 'red' | 'orange' | 'yellow' | 'green'
  | 'cyan' | 'blue' | 'purple' | 'pink' | 'neutral'

export type ViewMode = 'grid' | 'grouped'
