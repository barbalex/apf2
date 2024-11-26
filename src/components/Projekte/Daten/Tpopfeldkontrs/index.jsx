import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createTpopfeldkontrQuery } from '../../../../modules/createTpopfeldkontrQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { tpopId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopfeldkontrQuery({
        tpopId,
        ekGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopfeldkontrs = data?.data?.tpopById?.tpopfeldkontrs?.nodes ?? []
    const totalCount =
      data?.data?.tpopById?.tpopfeldkontrsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopfeldkontrs}
        title="Feld-Kontrollen"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.tpopkontr}
      />
    )
  }),
)
