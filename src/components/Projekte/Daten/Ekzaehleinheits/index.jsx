import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createEkzaehleinheitsQuery } from '../../../../modules/createEkzaehleinheitsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { ekzaehleinheitGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createEkzaehleinheitsQuery({
        apId,
        ekzaehleinheitGqlFilterForTree,
        apolloClient,
      }),
    )
    const ekzaehleinheits =
      data?.data?.apById?.ekzaehleinheitsByApId?.nodes ?? []
    const totalCount = data?.data?.apById?.ekzaehleinheitsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={ekzaehleinheits}
        title="EK-Zähleinheiten"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ekzaehleinheit}
      />
    )
  }),
)
