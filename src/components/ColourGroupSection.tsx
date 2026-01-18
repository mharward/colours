import { useState } from 'react'
import { SavedColour, ColourGroup } from '../types'
import { getGroupLabel } from '../utils/colourUtils'
import { ColourCard } from './ColourCard'
import './ColourGroupSection.css'

interface ColourGroupSectionProps {
  group: ColourGroup
  colours: SavedColour[]
  onDelete: (id: string) => void
  onUpdateName: (id: string, customName: string | undefined) => void
}

export function ColourGroupSection({ group, colours, onDelete, onUpdateName }: ColourGroupSectionProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="colour-group-section">
      <button
        className="colour-group-header"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className={`colour-group-chevron ${collapsed ? 'collapsed' : ''}`}>
          ▼
        </span>
        <span className="colour-group-label">{getGroupLabel(group)}</span>
        <span className="colour-group-count">{colours.length}</span>
      </button>

      {!collapsed && (
        <div className="colour-group-grid">
          {colours.map(colour => (
            <ColourCard
              key={colour.id}
              colour={colour}
              onDelete={onDelete}
              onUpdateName={onUpdateName}
            />
          ))}
        </div>
      )}
    </div>
  )
}
