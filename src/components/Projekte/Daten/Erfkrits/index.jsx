import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createErfkritsQuery } from '../../../../modules/createErfkritsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { erfkritGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createErfkritsQuery({
        apId,
        erfkritGqlFilterForTree,
        apolloClient,
      }),
    )
    const erfkrits = data?.data?.apById?.erfkritsByApId?.nodes ?? []
    const totalCount = data?.data?.apById?.erfkritsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={erfkrits}
        title="AP-Erfolgskriterien"
        totalCount={totalCount}
        menuBar={<Menu />}
      />
    )
  }),
)
