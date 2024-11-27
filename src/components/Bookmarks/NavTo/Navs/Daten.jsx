import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StoreContext } from '../../../../storeContext.js'
import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Nav } from '../Nav.jsx'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 0 3px 0 5px;
  height: 40px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
`

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

    // TODO: relative paths are not working using Link
    // use a with onClick instead
    return (
      <Container>
        {navData.menus.map((item) => (
          <Nav
            key={item.id}
            item={item}
          />
        ))}
      </Container>
    )
  }),
)
