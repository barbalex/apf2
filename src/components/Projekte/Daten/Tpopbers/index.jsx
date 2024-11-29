import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createTpopbersQuery } from '../../../../modules/createTpopbersQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { tpopId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopberGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopbersQuery({
        tpopId,
        tpopberGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopbers = data?.data?.tpopById?.tpopbersByTpopId?.nodes ?? []
    const totalCount = data?.data?.tpopById?.tpopbersCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopbers}
        title="Kontroll-Berichte"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.tpopber}
      />
    )
  }),
)
