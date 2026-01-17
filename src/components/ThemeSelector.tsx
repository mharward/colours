import { useTheme } from '../context/ThemeContext'
import './ThemeSelector.css'

const options = [
  { value: 'system', label: 'System', icon: '💻' },
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
] as const

export function ThemeSelector() {
  const { mode, setMode } = useTheme()

  return (
    <div className="theme-selector">
      {options.map((option) => (
        <button
          key={option.value}
          className={`theme-option ${mode === option.value ? 'active' : ''}`}
          onClick={() => setMode(option.value)}
          title={option.label}
        >
          <span className="theme-option-icon">{option.icon}</span>
          <span className="theme-option-label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}
