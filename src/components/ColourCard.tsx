import { useState } from 'react'
import { SavedColour } from '../types'
import { createGlowColour, getDisplayName } from '../utils/colourUtils'
import { ColourOutput } from './ColourOutput'
import './ColourCard.css'

interface ColourCardProps {
  colour: SavedColour
  onDelete: (id: string) => void
  onUpdateName: (id: string, customName: string | undefined) => void
}

const GLOW_OPACITY = 0.4

export function ColourCard({ colour, onDelete, onUpdateName }: ColourCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const glowColour = createGlowColour(colour.formats.rgba, GLOW_OPACITY)
  const displayName = getDisplayName(colour)
  const hasCustomName = colour.customName !== undefined

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(displayName)
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== colour.autoName) {
      onUpdateName(colour.id, trimmed)
    } else {
      onUpdateName(colour.id, undefined)
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const handleResetName = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdateName(colour.id, undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

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
        <div className="colour-card-info">
          {isEditing ? (
            <input
              type="text"
              className="colour-card-name-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <span
              className={`colour-card-name ${hasCustomName ? 'custom' : ''}`}
              onClick={handleStartEdit}
              title="Click to edit name"
            >
              {displayName}
            </span>
          )}
          <span className="colour-card-hex">{colour.formats.hex}</span>
        </div>
        <div className="colour-card-actions">
          {hasCustomName && !isEditing && (
            <button
              className="colour-card-reset"
              onClick={handleResetName}
              title="Reset to auto-generated name"
            >
              ↺
            </button>
          )}
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
