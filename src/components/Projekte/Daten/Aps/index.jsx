import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { projId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { apGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createApsQuery({
        projId,
        apGqlFilterForTree,
        apolloClient,
      }),
    )
    const aps = data?.data?.allAps?.nodes ?? []
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={aps}
        title="Arten"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ap}
      />
    )
  }),
)
