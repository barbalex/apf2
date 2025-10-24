import { useContext, useState, useEffect } from 'react'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { menus } from '../components/Docs/menus.js'

export const useDocsNavData = () => {
  const store = useContext(MobxContext)
  const filterValue = store.tree.nodeLabelFilter.doc

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
  const refetch = () => setRerenderer((prev) => prev + 1)

  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return { isLoading: false, error: undefined, navData }
}
