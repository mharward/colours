import { useState, useEffect, useRef } from 'react'
import { copyToClipboard } from '../utils/colourUtils'
import './ColourOutput.css'

const COPIED_FEEDBACK_MS = 1500

interface ColourOutputProps {
  label: string
  value: string
}

export function ColourOutput({ label, value }: ColourOutputProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      await copyToClipboard(value)
      setCopied(true)
      timeoutRef.current = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      // Clipboard access denied - fail silently
    }
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
