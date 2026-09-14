import { graphql } from '../gql'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopkontrzaehlEinheitWertesNavData = () => {
  const apolloClient = useApolloClient()

  const tpopkontrzaehlEinheitWerteGqlFilterForTree = useAtomValue(
    treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpopkontrzaehlEinheitWerte',
      tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeTpopkontrzaehlEinheitWertesQuery(
            $filter: TpopkontrzaehlEinheitWerteFilter!
          ) {
            allTpopkontrzaehlEinheitWertes(
              filter: $filter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allTpopkontrzaehlEinheitWertes {
              totalCount
            }
          }
        `),
        variables: {
          filter: tpopkontrzaehlEinheitWerteGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data!
    },
  })

  const count = data.allTpopkontrzaehlEinheitWertes?.nodes.length
  const totalCount = data.totalCount?.totalCount

  const navData = {
    id: 'TpopkontrzaehlEinheitWerte',
    listFilter: 'tpopkontrzaehlEinheitWerte',
    url: `/Daten/Werte-Listen/TpopkontrzaehlEinheitWerte`,
    label: `Teil-Population: Zähl-Einheiten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'TpopkontrzaehlEinheitWerte',
    treeId: `tpopkontrzaehlEinheitWerteFolder`,
    treeTableId: null,
    treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
    hasChildren: !!count,
    fetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: data.allTpopkontrzaehlEinheitWertes?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopkontrzaehlEinheitWerte',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
