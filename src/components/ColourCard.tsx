import { useState } from 'react'
import { SavedColour } from '../types'
import { createGlowColour } from '../utils/colourUtils'
import { ColourOutput } from './ColourOutput'
import './ColourCard.css'

interface ColourCardProps {
  colour: SavedColour
  onDelete: (id: string) => void
}

const GLOW_OPACITY = 0.4

export function ColourCard({ colour, onDelete }: ColourCardProps) {
  const [expanded, setExpanded] = useState(false)

  const glowColour = createGlowColour(colour.formats.rgba, GLOW_OPACITY)

  return (
    <div
      className={`colour-card ${expanded ? 'expanded' : ''}`}
      style={{ '--swatch-glow': glowColour, '--card-glow': glowColour } as React.CSSProperties}
    >
      <div
        className="colour-card-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="colour-card-swatch"
          style={{ backgroundColor: colour.formats.hex8 }}
        />
        <span className="colour-card-hex">{colour.formats.hex}</span>
        <button
          className="colour-card-delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(colour.id)
          }}
          title="Remove colour"
        >
          ×
        </button>
      </div>

      {expanded && (
        <>
          <div className="colour-card-divider" />
          <div className="colour-card-formats">
            <ColourOutput label="HEX" value={colour.formats.hex} />
            <ColourOutput label="HEX8" value={colour.formats.hex8} />
            <ColourOutput label="RGB" value={colour.formats.rgb} />
            <ColourOutput label="RGBA" value={colour.formats.rgba} />
            <ColourOutput label="HSL" value={colour.formats.hsl} />
            <ColourOutput label="HSLA" value={colour.formats.hsla} />
          </div>
        </>
      )}
    </div>
  )
}
