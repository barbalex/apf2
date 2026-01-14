import { createContext } from 'react'
import type { Instance } from 'mobx-state-tree'
import type { MobxStore } from './store/index.ts'

export const MobxContext = createContext<
  Instance<typeof MobxStore> | Record<string, never>
>({})
