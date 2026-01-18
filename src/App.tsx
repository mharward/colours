import { useState } from 'react'
import { ColourInput, MAX_COLOURS } from './components/ColourInput'
import { ColourList } from './components/ColourList'
import { ThemeSelector } from './components/ThemeSelector'
import { SavedColour } from './types'
import './App.css'

function App() {
  const [colours, setColours] = useState<SavedColour[]>([])

  const handleAddColours = (newColours: SavedColour[]) => {
    setColours(prev => {
      const combined = [...newColours, ...prev]
      return combined.slice(0, MAX_COLOURS)
    })
  }

  const handleDeleteColour = (id: string) => {
    setColours(prev => prev.filter(c => c.id !== id))
  }

  const handleUpdateColourName = (id: string, customName: string | undefined) => {
    setColours(prev => prev.map(c =>
      c.id === id ? { ...c, customName } : c
    ))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">
              <span className="brand-icon-inner"></span>
            </div>
            <h1 className="title">Colour Converter</h1>
          </div>
          <ThemeSelector />
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">
          <section className="input-section">
            <ColourInput onAddColours={handleAddColours} currentCount={colours.length} />
          </section>
          <section className="list-section">
            <ColourList
              colours={colours}
              onDelete={handleDeleteColour}
              onUpdateName={handleUpdateColourName}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
