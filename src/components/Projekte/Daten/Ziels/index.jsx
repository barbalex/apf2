import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createZielsQuery } from '../../../../modules/createZielsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId, jahr } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { zielGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createZielsQuery({
        apId,
        zielGqlFilterForTree,
        apolloClient,
        jahr,
      }),
    )
    const ziels = data?.data?.apById?.zielsByApId?.nodes ?? []
    const totalCount = data?.data?.apById?.zielsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={ziels}
        title={`Ziele für das Jahr ${jahr}`}
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ziel}
      />
    )
  }),
)
