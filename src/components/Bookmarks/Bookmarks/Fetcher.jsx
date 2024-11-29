import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../storeContext.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.jsx'

export const Fetcher = memo(
  observer(({ match, fetcherModule }) => {
    const store = useContext(StoreContext)

    const fetcherName = match.handle?.bookmarkFetcherName
    const filterNames = match.handle?.filterNames

    // calling filter even though not used here so useRootNavData re-runs when the filter changes
    // TODO: check if fallback works
    let args = {}
    filterNames?.forEach((filterName) => {
      const filter = store.tree?.[filterName] ?? {
        id: { notEqualTo: '99999999-9999-9999-9999-999999999999' },
      }
      if (!filter) return
      args = { ...args, [filterName]: filter }
    })
    const { navData, isLoading, error } = fetcherModule?.[fetcherName](args)

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <Bookmark
        key={navData.id}
        navData={navData}
      />
    )
  }),
)
