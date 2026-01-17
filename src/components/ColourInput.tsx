import { useState, useEffect } from 'react'
import { parseColour, parseMultipleColours, ColourFormats } from '../utils/colourUtils'
import { SavedColour } from '../types'
import './ColourInput.css'

interface ColourInputProps {
  onAddColours: (colours: SavedColour[]) => void
}

export function ColourInput({ onAddColours }: ColourInputProps) {
  const [textInput, setTextInput] = useState('')
  const [pickerValue, setPickerValue] = useState('#6366f1')
  const [preview, setPreview] = useState<ColourFormats | null>(null)
  const [isValid, setIsValid] = useState(true)
  const [activeSource, setActiveSource] = useState<'text' | 'picker'>('text')

  useEffect(() => {
    if (activeSource === 'text') {
      if (!textInput.trim()) {
        setPreview(null)
        setIsValid(true)
        return
      }
      // Try single colour first
      const result = parseColour(textInput)
      if (result.valid) {
        setIsValid(true)
        setPreview(result.formats)
        return
      }
      // Try multiple colours
      const multipleResults = parseMultipleColours(textInput)
      if (multipleResults.length > 0) {
        setIsValid(true)
        // Show first colour as preview for multi-colour input
        setPreview(multipleResults[0].formats)
        return
      }
      // Neither worked
      setIsValid(false)
      setPreview(null)
    }
  }, [textInput, activeSource])

  useEffect(() => {
    if (activeSource === 'picker') {
      const result = parseColour(pickerValue)
      setPreview(result.formats)
      setIsValid(true)
    }
  }, [pickerValue, activeSource])

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value)
    setActiveSource('text')
  }

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickerValue(e.target.value)
    setActiveSource('picker')
    setTextInput(e.target.value)
  }

  const handleAdd = () => {
    const input = activeSource === 'text' ? textInput : pickerValue

    // Check for multiple colours (comma or newline separated)
    const multipleResults = parseMultipleColours(input)

    if (multipleResults.length > 0) {
      const newColours: SavedColour[] = multipleResults.map((result, index) => ({
        id: `${Date.now()}-${index}`,
        originalInput: result.formats!.hex,
        formats: result.formats!,
      }))
      onAddColours(newColours)
      setTextInput('')
      setPreview(null)
    }
  }

  const canAdd = preview !== null && isValid

  return (
    <div className="colour-input-section">
      <div className="input-row">
        <input
          type="text"
          className={`colour-text-input ${!isValid && textInput ? 'invalid' : ''}`}
          placeholder="Enter colour(s) - e.g. #ff6600, red, rgb(255, 102, 0)"
          value={textInput}
          onChange={handleTextChange}
          autoFocus
        />
        <input
          type="color"
          className="colour-picker"
          value={pickerValue}
          onChange={handlePickerChange}
          title="Pick a colour"
        />
        <button
          className="add-button"
          onClick={handleAdd}
          disabled={!canAdd}
        >
          Add
        </button>
      </div>

      {!isValid && textInput && (
        <p className="error-message">Unable to parse colour</p>
      )}

      {preview && (
        <div
          className="colour-preview-small"
          style={{
            backgroundColor: preview.hex8,
            '--preview-glow': preview.rgba.replace(/[\d.]+\)$/, '0.35)')
          } as React.CSSProperties}
          title={preview.hex}
        />
      )}
    </div>
  )
}
