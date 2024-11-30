import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createTpopkontrzaehlsQuery } from '../../../../modules/createTpopkontrzaehlsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { tpopkontrId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { tpopkontrzaehlGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createTpopkontrzaehlsQuery({
        tpopkontrId,
        tpopkontrzaehlGqlFilterForTree,
        apolloClient,
      }),
    )
    const tpopkontrzaehls =
      data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
    const count = tpopkontrzaehls.length
    const totalCount =
      data?.data?.tpopkontrById?.tpopkontrzaehlsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={tpopkontrzaehls}
        title={`Zählungen (${isLoading ? '...' : `${count}/${totalCount}`})`}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.tpopkontrzaehl}
      />
    )
  }),
)
