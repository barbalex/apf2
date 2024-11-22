import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { createEkAbrechnungstypWertesQuery } from '../../../../modules/createEkAbrechnungstypWertesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekAbrechnungstypWerteGqlFilterForTree, nodeLabelFilter } =
      store.tree

    const { data, isLoading, error } = useQuery(
      createEkAbrechnungstypWertesQuery({
        ekAbrechnungstypWerteGqlFilterForTree,
        apolloClient,
      }),
    )
    const ekAbrechnungstypWertes =
      data?.data?.allEkAbrechnungstypWertes?.nodes ?? []
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={ekAbrechnungstypWertes}
        title="Teil-Population: EK-Abrechnungstypen"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ekAbrechnungstypWerte}
      />
    )
  }),
)
