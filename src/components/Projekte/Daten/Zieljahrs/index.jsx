import { memo, useContext, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import union from 'lodash/union'
import { useAtom } from 'jotai'

import { MobxContext } from '../../../../mobxContext.js'
import { useZieljahrsNavData } from '../../../../modules/useZieljahrsNavData.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Ap } from '../Ap/index.jsx'

export const Component = memo(
  observer(() => {
    const [isDesktopView] = useAtom(isDesktopViewAtom)

    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(MobxContext)
    const { zielGqlFilterForTree, nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useZieljahrsNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    if (isDesktopView) return <Ap />

    return (
      <List
        items={navData.menus}
        title={navData.label}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.ziel}
      />
    )
  }),
)
