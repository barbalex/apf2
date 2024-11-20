import { memo, useContext, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import union from 'lodash/union'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createZielsQuery } from '../../../../modules/createZielsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { zielGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createZielsQuery({
        apId,
        zielGqlFilterForTree,
        apolloClient,
      }),
    )

    const ziels = data?.data?.apById?.zielsByApId?.nodes ?? []
    const zieljahreItems = useMemo(
      () =>
        ziels
          // reduce to distinct years
          .reduce((a, el) => union(a, [el.jahr]), [])
          .sort((a, b) => a - b)
          .map((z) => ({
            id: z,
            label: z,
          })),
      [ziels],
    )

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={zieljahreItems}
        title="AP-Ziele Jahre"
        totalCount={zieljahreItems.length}
        menuBar={<Menu />}
      />
    )
  }),
)
