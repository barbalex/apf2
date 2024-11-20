import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { createTpopkontrzaehlEinheitWertesQuery } from '../../../../modules/createTpopkontrzaehlEinheitWertesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopkontrzaehlEinheitWerteGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopkontrzaehlEinheitWertesQuery({
        tpopkontrzaehlEinheitWerteGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopkontrzaehlEinheitWertes =
      data?.data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopkontrzaehlEinheitWertes}
        title="Teil-Population: Zähl-Einheiten"
        totalCount={totalCount}
        menuBar={<Menu />}
      />
    )
  }),
)
