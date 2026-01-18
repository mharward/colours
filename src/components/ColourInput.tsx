import { useState, useEffect } from 'react'
import { parseColour, parseMultipleColours, createGlowColour, generateColourName, extractColourMetrics } from '../utils/colourUtils'
import { ColourFormats, SavedColour } from '../types'
import './ColourInput.css'

export const MAX_COLOURS = 100

const PREVIEW_GLOW_OPACITY = 0.35

interface ColourInputProps {
  onAddColours: (colours: SavedColour[]) => void
  currentCount: number
}

export function ColourInput({ onAddColours, currentCount }: ColourInputProps) {
  const [textInput, setTextInput] = useState('')
  const [pickerValue, setPickerValue] = useState('#6366f1')
  const [preview, setPreview] = useState<ColourFormats | null>(null)
  const [isValid, setIsValid] = useState(true)
  const [activeSource, setActiveSource] = useState<'text' | 'picker'>('text')

  const remaining = MAX_COLOURS - currentCount
  const atCapacity = remaining <= 0
  const nearCapacity = remaining <= 10 && remaining > 0

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
    if (atCapacity) return

    const input = activeSource === 'text' ? textInput : pickerValue

    // Check for multiple colours (comma or newline separated)
    const multipleResults = parseMultipleColours(input)

    if (multipleResults.length > 0) {
      // Limit to remaining capacity
      const limitedResults = multipleResults.slice(0, remaining)

      const newColours: SavedColour[] = limitedResults.map((result, index) => {
        const metrics = extractColourMetrics(result.formats.hsl)
        return {
          id: `${Date.now()}-${index}`,
          originalInput: result.originalInput,
          formats: result.formats,
          autoName: generateColourName(result.formats.hex),
          hue: metrics.hue,
          saturation: metrics.saturation,
          lightness: metrics.lightness,
        }
      })
      onAddColours(newColours)
      setTextInput('')
      setPreview(null)
    }
  }

  const canAdd = preview !== null && isValid && !atCapacity

  return (
    <div className="colour-input-section">
      <div className="input-row">
        <input
          type="text"
          className={`colour-text-input ${!isValid && textInput ? 'invalid' : ''}`}
          placeholder="Enter colour(s) - e.g. #ff6600, red, rgb(255, 102, 0)"
          value={textInput}
          onChange={handleTextChange}
          disabled={atCapacity}
          autoFocus
        />
        <input
          type="color"
          className="colour-picker"
          value={pickerValue}
          onChange={handlePickerChange}
          disabled={atCapacity}
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

      {atCapacity && (
        <p className="capacity-warning capacity-full">
          Maximum capacity reached ({MAX_COLOURS} colours)
        </p>
      )}

      {nearCapacity && (
        <p className="capacity-warning">
          {remaining} {remaining === 1 ? 'slot' : 'slots'} remaining
        </p>
      )}

      {preview && (
        <div
          className="colour-preview-small"
          style={{
            backgroundColor: preview.hex8,
            '--preview-glow': createGlowColour(preview.rgba, PREVIEW_GLOW_OPACITY)
          } as React.CSSProperties}
          title={preview.hex}
        />
      )}
    </div>
  )
}
