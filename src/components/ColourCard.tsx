import { useState } from 'react'
import { SavedColour } from '../types'
import { ColourOutput } from './ColourOutput'
import './ColourCard.css'

interface ColourCardProps {
  colour: SavedColour
  onDelete: (id: string) => void
}

export function ColourCard({ colour, onDelete }: ColourCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`colour-card ${expanded ? 'expanded' : ''}`}>
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
        <div className="colour-card-formats">
          <ColourOutput label="HEX" value={colour.formats.hex} />
          <ColourOutput label="HEX8" value={colour.formats.hex8} />
          <ColourOutput label="RGB" value={colour.formats.rgb} />
          <ColourOutput label="RGBA" value={colour.formats.rgba} />
          <ColourOutput label="HSL" value={colour.formats.hsl} />
          <ColourOutput label="HSLA" value={colour.formats.hsla} />
        </div>
      )}
    </div>
  )
}
