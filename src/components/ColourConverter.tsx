import { useState } from 'react'
import { parseColour, ColourFormats } from '../utils/colourUtils'
import { ColourOutput } from './ColourOutput'
import './ColourConverter.css'

export function ColourConverter() {
  const [input, setInput] = useState('')
  const [formats, setFormats] = useState<ColourFormats | null>(null)
  const [isValid, setIsValid] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)

    if (!value.trim()) {
      setFormats(null)
      setIsValid(true)
      return
    }

    const result = parseColour(value)
    setIsValid(result.valid)
    setFormats(result.formats)
  }

  return (
    <div className="colour-converter">
      <div className="input-section">
        <input
          type="text"
          className={`colour-input ${!isValid && input ? 'invalid' : ''}`}
          placeholder="Paste a colour (e.g. #ff6600, rgb(255, 102, 0), hsl(24, 100%, 50%))"
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        {!isValid && input && (
          <p className="error-message">Unable to parse colour</p>
        )}
      </div>

      {formats && (
        <>
          <div
            className="colour-preview"
            style={{ backgroundColor: formats.hex8 }}
          />

          <div className="outputs-section">
            <ColourOutput label="HEX" value={formats.hex} />
            <ColourOutput label="HEX8" value={formats.hex8} />
            <ColourOutput label="RGB" value={formats.rgb} />
            <ColourOutput label="RGBA" value={formats.rgba} />
            <ColourOutput label="HSL" value={formats.hsl} />
            <ColourOutput label="HSLA" value={formats.hsla} />
          </div>
        </>
      )}
    </div>
  )
}
