import { useState } from 'react'
import { SavedColour } from '../types'
import { copyToClipboard } from '../utils/colourUtils'
import { exportAsMarkdown, exportAsCssVariables } from '../utils/exportUtils'
import './ExportToolbar.css'

interface ExportToolbarProps {
  colours: SavedColour[]
}

type CopiedState = 'none' | 'markdown' | 'css'

export function ExportToolbar({ colours }: ExportToolbarProps) {
  const [copied, setCopied] = useState<CopiedState>('none')

  const handleCopyMarkdown = async () => {
    const markdown = exportAsMarkdown(colours)
    await copyToClipboard(markdown)
    setCopied('markdown')
    setTimeout(() => setCopied('none'), 2000)
  }

  const handleCopyCss = async () => {
    const css = exportAsCssVariables(colours)
    await copyToClipboard(css)
    setCopied('css')
    setTimeout(() => setCopied('none'), 2000)
  }

  return (
    <div className="export-toolbar">
      <button
        className={`export-button ${copied === 'markdown' ? 'copied' : ''}`}
        onClick={handleCopyMarkdown}
        disabled={colours.length === 0}
      >
        {copied === 'markdown' ? 'Copied!' : 'Copy as Markdown'}
      </button>
      <button
        className={`export-button ${copied === 'css' ? 'copied' : ''}`}
        onClick={handleCopyCss}
        disabled={colours.length === 0}
      >
        {copied === 'css' ? 'Copied!' : 'Copy as CSS'}
      </button>
    </div>
  )
}
