import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createPopsQuery } from '../../../../modules/createPopsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { popGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createPopsQuery({
        apId,
        popGqlFilterForTree,
        apolloClient,
      }),
    )
    const pops = data?.data?.apById?.popsByApId?.nodes ?? []
    const count = pops.length
    const totalCount = data?.data?.apById?.popsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={pops}
        title={`Populationen (${isLoading ? '...' : `${count}/${totalCount}`})`}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.pop}
      />
    )
  }),
)
