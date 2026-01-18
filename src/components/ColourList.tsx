import { useState } from 'react'
import { SavedColour, ViewMode, ColourGroup } from '../types'
import { groupColours } from '../utils/colourUtils'
import { ColourCard } from './ColourCard'
import { ColourGroupSection } from './ColourGroupSection'
import { ExportToolbar } from './ExportToolbar'
import { MAX_COLOURS } from './ColourInput'
import './ColourList.css'

interface ColourListProps {
  colours: SavedColour[]
  onDelete: (id: string) => void
  onUpdateName: (id: string, customName: string | undefined) => void
}

export function ColourList({ colours, onDelete, onUpdateName }: ColourListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  if (colours.length === 0) {
    return (
      <div className="colour-list-empty">
        <div className="colour-list-empty-icon">*</div>
        <p>No colours saved yet. Add some colours above!</p>
      </div>
    )
  }

  const groupedColours = groupColours(colours)

  return (
    <div className="colour-list">
      <div className="colour-list-header">
        <h2 className="colour-list-title">
          Saved Colours
          <span className="colour-list-count">{colours.length} / {MAX_COLOURS}</span>
        </h2>
        <div className="colour-list-controls">
          <div className="view-toggle">
            <button
              className={`view-toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              Grid
            </button>
            <button
              className={`view-toggle-button ${viewMode === 'grouped' ? 'active' : ''}`}
              onClick={() => setViewMode('grouped')}
              title="Grouped view"
            >
              Grouped
            </button>
          </div>
          <ExportToolbar colours={colours} />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="colour-list-grid">
          {colours.map(colour => (
            <ColourCard
              key={colour.id}
              colour={colour}
              onDelete={onDelete}
              onUpdateName={onUpdateName}
            />
          ))}
        </div>
      ) : (
        <div className="colour-list-grouped">
          {Array.from(groupedColours.entries()).map(([group, groupColours]) => (
            <ColourGroupSection
              key={group}
              group={group as ColourGroup}
              colours={groupColours}
              onDelete={onDelete}
              onUpdateName={onUpdateName}
            />
          ))}
        </div>
      )}
    </div>
  )
}
