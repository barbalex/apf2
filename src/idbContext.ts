import { createContext } from 'react'
import type { IDBPDatabase } from 'idb'

interface IdbContextType {
  idb?: IDBPDatabase
}

export const IdbContext = createContext<IdbContextType>({})
