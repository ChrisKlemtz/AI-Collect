import { useEffect, useCallback } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
  preventDefault?: boolean
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in input fields (except for specific cases)
      const target = event.target as HTMLElement
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      for (const shortcut of shortcuts) {
        const isCtrlOrCmd = shortcut.ctrlOrCmd
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey

        const isShift = shortcut.shift ? event.shiftKey : !event.shiftKey
        const isAlt = shortcut.alt ? event.altKey : !event.altKey

        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()

        if (keyMatches && isCtrlOrCmd && isShift && isAlt) {
          // Allow Escape and some Ctrl/Cmd shortcuts even in input fields
          const allowedInInputs = ['Escape', 'Enter']
          const isCtrlShortcut = shortcut.ctrlOrCmd

          if (!isInputField || allowedInInputs.includes(event.key) || isCtrlShortcut) {
            if (shortcut.preventDefault !== false) {
              event.preventDefault()
            }
            shortcut.action()
            break
          }
        }
      }
    },
    [shortcuts, enabled]
  )

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  // Helper to get platform-specific modifier key name
  const getModifierKey = useCallback(() => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    return isMac ? '⌘' : 'Ctrl'
  }, [])

  return { getModifierKey }
}

// Helper function to format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const parts: string[] = []

  if (shortcut.ctrlOrCmd) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) {
    parts.push('Shift')
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }

  parts.push(shortcut.key.toUpperCase())

  return parts.join(isMac ? '' : '+')
}
