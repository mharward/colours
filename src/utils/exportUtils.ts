import { SavedColour, ColourGroup } from '../types'
import { groupColours, getDisplayName, getGroupLabel } from './colourUtils'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function exportAsMarkdown(colours: SavedColour[]): string {
  const groups = groupColours(colours)
  const lines: string[] = []

  for (const [group, groupColours] of groups) {
    lines.push(`## ${getGroupLabel(group)}`)
    lines.push('')
    lines.push('| Name | HEX | RGB | HSL |')
    lines.push('|------|-----|-----|-----|')

    for (const colour of groupColours) {
      const name = getDisplayName(colour)
      lines.push(`| ${name} | \`${colour.formats.hex}\` | \`${colour.formats.rgb}\` | \`${colour.formats.hsl}\` |`)
    }

    lines.push('')
  }

  return lines.join('\n')
}

export function exportAsCssVariables(colours: SavedColour[]): string {
  const groups = groupColours(colours)
  const lines: string[] = [':root {']

  let isFirst = true
  for (const [group, groupColours] of groups) {
    if (!isFirst) {
      lines.push('')
    }
    isFirst = false
    lines.push(`  /* ${getGroupLabel(group)} */`)

    for (const colour of groupColours) {
      const name = getDisplayName(colour)
      const varName = slugify(name)
      lines.push(`  --color-${varName}: ${colour.formats.hex};`)
    }
  }

  lines.push('}')
  return lines.join('\n')
}
