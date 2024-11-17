import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createTpopmassnbersQuery } from '../../../../modules/createTpopmassnbersQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { tpopId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopmassnberGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopmassnbersQuery({
        tpopId,
        tpopmassnberGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopmassnbers =
      data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []
    const totalCount = data?.data?.tpopById?.tpopmassnbersCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopmassnbers}
        title="Massnahmen-Berichte"
        totalCount={totalCount}
        menuBar={<Menu />}
      />
    )
  }),
)
