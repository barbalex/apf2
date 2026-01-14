import { createContext } from 'react'

export const UploaderContext =
  createContext<React.RefObject<HTMLElement> | null>(null)
