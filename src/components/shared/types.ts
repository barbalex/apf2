/**
 * Shared field components call this handler to save a new field value.
 * Text fields pass real DOM events, radio buttons, checkboxes and selects
 * build fake events with only the fields saveToDb implementations read:
 * target.name and target.value
 */
export interface SaveToDbEvent {
  target: {
    name?: string | undefined
    // number[] is needed for ekfrequenz.kontrolljahre
    value: string | number | boolean | number[] | null
  }
}

export type SaveToDbHandler = (event: SaveToDbEvent) => void | Promise<void>
