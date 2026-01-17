import { SavedColour } from '../types'
import { ColourCard } from './ColourCard'
import './ColourList.css'

interface ColourListProps {
  colours: SavedColour[]
  onDelete: (id: string) => void
}

export function ColourList({ colours, onDelete }: ColourListProps) {
  if (colours.length === 0) {
    return (
      <div className="colour-list-empty">
        <div className="colour-list-empty-icon">🎨</div>
        <p>No colours saved yet. Add some colours above!</p>
      </div>
    )
  }

  return (
    <div className="colour-list">
      <div className="colour-list-header">
        <h2 className="colour-list-title">
          Saved Colours
          <span className="colour-list-count">{colours.length}</span>
        </h2>
      </div>
      <div className="colour-list-grid">
        {colours.map(colour => (
          <ColourCard
            key={colour.id}
            colour={colour}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
