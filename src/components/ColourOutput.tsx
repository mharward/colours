import { useState } from 'react'
import { copyToClipboard } from '../utils/colourUtils'
import './ColourOutput.css'

interface ColourOutputProps {
  label: string
  value: string
}

export function ColourOutput({ label, value }: ColourOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="colour-output">
      <span className="colour-output-label">{label}</span>
      <code className="colour-output-value">{value}</code>
      <button
        className={`colour-output-copy ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title={`Copy ${label}`}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
