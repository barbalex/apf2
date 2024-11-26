import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams, useLocation } from 'react-router'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { createBeobsQuery } from '../../../../modules/createBeobsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const { apId, tpopId } = useParams()
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { beobGqlFilterForTree, nodeLabelFilter } = store.tree
    const { pathname } = useLocation()

    const isBeobzugeordnet = !!tpopId && pathname.includes('Beobachtungen')
    const isBeobNichtBeurteilt =
      !tpopId && pathname.includes('nicht-beurteilte-Beobachtungen')
    const isBeobNichtZuzuordnen =
      !tpopId && pathname.includes('nicht-zuzuordnende-Beobachtungen')
    const type =
      isBeobzugeordnet ? 'zugeordnet'
      : isBeobNichtBeurteilt ? 'nichtBeurteilt'
      : isBeobNichtZuzuordnen ? 'nichtZuzuordnen'
      : 'noType'
    const apfloraLayer =
      type === 'zugeordnet' ? 'beobZugeordnet'
      : type === 'nichtBeurteilt' ? 'beobNichtBeurteilt'
      : type === 'nichtZuzuordnen' ? 'beobNichtZuzuordnen'
      : 'beobNichtZuzuordnen'
    const title =
      type === 'zugeordnet' ? 'Beobachtungen zugeordnet'
      : type === 'nichtBeurteilt' ? 'Beobachtungen nicht beurteilt'
      : type === 'nichtZuzuordnen' ? 'Beobachtungen nicht zuzuordnen'
      : 'Beobachtungen'

    const { data, isLoading, error } = useQuery(
      createBeobsQuery({
        tpopId,
        apId: tpopId ? undefined : apId,
        beobGqlFilterForTree,
        apolloClient,
        type,
      }),
    )
    const beobs = data?.data?.allBeobs?.nodes ?? []
    const totalCount = data?.data?.beobsCount?.totalCount ?? 0

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={beobs}
        title={title}
        totalCount={totalCount}
        menuBar={<Menu apfloraLayer={apfloraLayer} />}
        highlightSearchString={nodeLabelFilter.beob}
      />
    )
  }),
)
