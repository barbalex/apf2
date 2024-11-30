import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createZielbersQuery } from '../../../../modules/createZielbersQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { zielId, jahr } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { zielberGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createZielbersQuery({
        zielId,
        zielberGqlFilterForTree,
        apolloClient,
      }),
    )
    const zielbers = data?.data?.zielById?.zielbersByZielId?.nodes ?? []
    const count = zielbers.length
    const totalCount = data?.data?.zielById?.zielbersCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={zielbers}
        title={`Zielberichte (${isLoading ? '...' : `${count}/${totalCount}`})`}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.zielber}
      />
    )
  }),
)
