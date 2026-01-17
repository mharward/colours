import { useState } from 'react'
import { ColourInput } from './components/ColourInput'
import { ColourList } from './components/ColourList'
import { SavedColour } from './types'
import './App.css'

function App() {
  const [colours, setColours] = useState<SavedColour[]>([])

  const handleAddColours = (newColours: SavedColour[]) => {
    setColours(prev => [...newColours, ...prev])
  }

  const handleDeleteColour = (id: string) => {
    setColours(prev => prev.filter(c => c.id !== id))
  }

  return (
    <main className="app">
      <h1 className="title">Colour Converter</h1>
      <div className="app-content">
        <ColourInput onAddColours={handleAddColours} />
        <ColourList colours={colours} onDelete={handleDeleteColour} />
      </div>
    </main>
  )
}

export default App
