import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { createTpopApberrelevantGrundWertesQuery } from '../../../../modules/createTpopApberrelevantGrundWertesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopApberrelevantGrundWerteGqlFilterForTree, nodeLabelFilter } =
      store.tree

    const { data, isLoading, error } = useQuery(
      createTpopApberrelevantGrundWertesQuery({
        tpopApberrelevantGrundWerteGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopApberrelevantGrundWertes =
      data?.data?.allTpopApberrelevantGrundWertes?.nodes ?? []
    const count = tpopApberrelevantGrundWertes.length
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopApberrelevantGrundWertes}
        title={`Teil-Population: Grund für AP-Bericht Relevanz (${isLoading ? '...' : `${count}/${totalCount}`})`}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.tpopApberrelevantGrundWerte}
      />
    )
  }),
)
