import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createAssozartsQuery } from '../../../../modules/createAssozartsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { assozartGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createAssozartsQuery({
        apId,
        assozartGqlFilterForTree,
        apolloClient,
      }),
    )
    const assozarts = data?.data?.apById?.assozartsByApId?.nodes ?? []
    const count = assozarts.length
    const totalCount = data?.data?.apById?.assozartsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={assozarts}
        title={`Assoziierte Arten (${isLoading ? '...' : `${count}/${totalCount}`})`}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.assozart}
      />
    )
  }),
)
