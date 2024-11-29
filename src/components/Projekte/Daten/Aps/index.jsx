import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useApsNavData } from '../../../../modules/useApsNavData.js'

export const Component = memo(
  observer(() => {
    const { projId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useApsNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={navData.menus}
        title={navData.label}
        totalCount={navData.totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ap}
      />
    )
  }),
)
