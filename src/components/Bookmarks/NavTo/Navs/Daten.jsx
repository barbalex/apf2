import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { title } from 'process'

export const DatenNav = memo(
  observer(() => {
    const store = useContext(StoreContext)
    // calling filter even though not used here so useRootNavData re-runs when the filter changes
    const { userGqlFilterForTree } = store.tree
    const { navData, isLoading, error } = useRootNavData({
      userGqlFilterForTree,
    })

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return <div>{navData.menus.map((item) => item.label)}</div>
  }),
)
