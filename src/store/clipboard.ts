// copy/move state for Pop/TPop and biotop copying
import { atom } from 'jotai'

// Copying
export interface Copying {
  table: string | null
  id: string | null
  label: string | null
  withNextLevel: boolean
}

export const copyingAtom = atom<Copying>({
  table: null,
  id: null,
  label: null,
  withNextLevel: false,
})

export const setCopyingAtom = atom(
  null,
  (
    _get,
    set,
    {
      table,
      id,
      label,
      withNextLevel,
    }: {
      table?: string | null | undefined
      id?: string | null | undefined
      label?: string | null | undefined
      withNextLevel: boolean
    },
  ) => {
    set(copyingAtom, {
      table: table ?? null,
      id: id ?? null,
      label: label ?? null,
      withNextLevel,
    })
  },
)

export const copyingBiotopAtom = atom({
  id: null,
  label: null,
})

export const setCopyingBiotopAtom = atom(null, (_get, set, { id, label }) => {
  set(copyingBiotopAtom, { id, label })
})

export interface Moving {
  table: string | null
  id: string | null
  label: string | null
  toTable: string | null
  fromParentId: string | null
}

export const movingAtom = atom<Moving>({
  table: null,
  id: null,
  label: null,
  toTable: null,
  fromParentId: null,
})

export const setMovingAtom = atom(
  null,
  (
    _get,
    set,
    {
      table,
      id,
      label,
      toTable,
      fromParentId,
    }: {
      table?: string | null | undefined
      id?: string | null | undefined
      label?: string | null | undefined
      toTable?: string | null | undefined
      fromParentId?: string | null | undefined
    },
  ) => {
    set(movingAtom, {
      table: table ?? null,
      id: id ?? null,
      label: label ?? null,
      toTable: toTable ?? null,
      fromParentId: fromParentId ?? null,
    })
  },
)
