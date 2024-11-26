import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createTpopsQuery } from '../../../../modules/createTpopsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId, popId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopsQuery({
        popId,
        tpopGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpops = data?.data?.popById?.tpopsByPopId?.nodes ?? []
    const totalCount = data?.data?.popById?.tpopsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpops}
        title="Teil-Populationen"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.tpop}
      />
    )
  }),
)
