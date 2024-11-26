import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createApberuebersichtsQuery } from '../../../../modules/createApberuebersichtsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { projId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { apberuebersichtGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createApberuebersichtsQuery({
        projId,
        apberuebersichtGqlFilterForTree,
        apolloClient,
      }),
    )
    const apberuebersichts = data?.data?.allApberuebersichts?.nodes ?? []
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={apberuebersichts}
        title="AP-Berichte"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.apberuebersicht}
      />
    )
  }),
)
