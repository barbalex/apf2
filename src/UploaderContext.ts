import { createContext, type RefObject } from 'react'

export const UploaderContext = createContext<RefObject<HTMLElement> | null>(
  null,
)
