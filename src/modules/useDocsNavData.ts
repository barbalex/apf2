import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeNodeLabelFilterAtom,
  treeApGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { menus } from '../components/Docs/menus.ts'

export const useDocsNavData = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const filterValue = nodeLabelFilter.doc

  const navData = {
    id: 'Dokumentation',
    url: `/Dokumentation`,
    label: 'Dokumentation',
    listFilter: 'doc',
    // leave totalCount undefined as the menus are folders
    menus:
      filterValue ?
        menus.filter((m) =>
          m.label?.toLowerCase?.().includes(filterValue?.toLowerCase?.()),
        )
      : menus,
  }

  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeApGqlFilterForTreeAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return navData
}
