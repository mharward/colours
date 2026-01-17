import { ColourFormats } from './utils/colourUtils'

export interface SavedColour {
  id: string
  originalInput: string
  formats: ColourFormats
}
