import { memo, useContext, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createPopbersQuery } from '../../../../modules/createPopbersQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { popId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { popberGqlFilterForTree, nodeLabelFilter } = store.tree

    const { data, isLoading, error } = useQuery(
      createPopbersQuery({
        popId,
        popberGqlFilterForTree,
        apolloClient,
      }),
    )
    const popbers = data?.data?.popById?.popbersByPopId?.nodes ?? []
    const totalCount = data?.data?.popById?.popbersCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={popbers}
        title="Kontroll-Berichte"
        totalCount={totalCount}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.popber}
      />
    )
  }),
)
