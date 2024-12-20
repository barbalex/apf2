import { useMemo, useContext, useState, useCallback, useEffect } from 'react'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { menus } from '../components/Docs/menus.js'

export const useDocsNavData = () => {
  const store = useContext(MobxContext)
  const filterValue = store.tree.nodeLabelFilter.doc

  const navData = useMemo(
    () => ({
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
    }),
    [filterValue],
  )
  const [, setRerenderer] = useState(0)
  const refetch = useCallback(() => {
    setRerenderer((prev) => prev + 1)
  }, [])
  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return { isLoading: false, error: undefined, navData }
}
