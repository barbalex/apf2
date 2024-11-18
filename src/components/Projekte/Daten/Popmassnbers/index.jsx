import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createPopmassnbersQuery } from '../../../../modules/createPopmassnbersQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { popId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { popmassnberGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createPopmassnbersQuery({
        popId,
        popmassnberGqlFilterForTree,
        apolloClient,
      }),
    )
    const popmassnbers = data?.data?.popById?.popmassnbersByPopId?.nodes ?? []
    const totalCount = data?.data?.popById?.popmassnbersCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={popmassnbers}
        title="Massnahmen-Berichte"
        totalCount={totalCount}
        menuBar={<Menu />}
      />
    )
  }),
)
