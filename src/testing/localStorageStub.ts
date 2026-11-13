// src/store/index.ts reads localStorage at module scope: atomWithStorage
// atoms use getOnInit and the mapActiveOverlays migration runs on import.
// Unit tests run in a node environment, so a stub must be installed before
// the store is imported — this file is a vitest setup file for exactly that.
class MemoryLocalStorage implements Storage {
  #map = new Map<string, string>()

  get length(): number {
    return this.#map.size
  }

  key(index: number): string | null {
    return [...this.#map.keys()][index] ?? null
  }

  getItem(key: string): string | null {
    return this.#map.has(key) ? (this.#map.get(key) as string) : null
  }

  setItem(key: string, value: string): void {
    this.#map.set(String(key), String(value))
  }

  removeItem(key: string): void {
    this.#map.delete(key)
  }

  clear(): void {
    this.#map.clear()
  }
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = new MemoryLocalStorage()
}
