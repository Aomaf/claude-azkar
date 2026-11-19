export type AzkarMode = 'auto' | 'morning' | 'evening' | 'general'
export type Counter = { id: string; count: number }

declare module 'claude-code' {
  interface PluginState {
    azkar: {
      spin: number
      counter: Counter | null
      isHidden: boolean
      isCompact: boolean
      mode: AzkarMode
      utcOffsetMinutes: number | null
    }
  }
}
