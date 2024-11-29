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
    const filterName = match.handle?.filterName

    // calling filter even though not used here so useRootNavData re-runs when the filter changes
    // TODO: check if fallback works
    const filter = store.tree?.[filterName] ?? {
      id: { notEqualTo: '99999999-9999-9999-9999-999999999999' },
    }
    const { navData, isLoading, error } = fetcherModule?.[fetcherName]({
      [filterName]: filter,
    })

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
