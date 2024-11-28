import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StoreContext } from '../../../../storeContext.js'
import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Nav } from '../Nav.jsx'

export const Menu = memo(
  observer(() => {
    const store = useContext(StoreContext)
    // calling filter even though not used here so useRootNavData re-runs when the filter changes
    const { userGqlFilterForTree } = store.tree
    const { navData, isLoading, error } = useRootNavData({
      userGqlFilterForTree,
    })

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return navData.menus.map((item, index) => (
      <Nav
        key={item.id}
        item={item}
        baseUrl={navData.url}
        needsBorderRight={index < navData.menus.length - 1}
      />
    ))
  }),
)
