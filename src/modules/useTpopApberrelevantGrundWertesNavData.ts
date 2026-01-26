import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store,
  treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopApberrelevantGrundWertesNavData = () => {
  const apolloClient = useApolloClient()

  const tpopApberrelevantGrundWerteGqlFilterForTree = useAtomValue(
    treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: [
      'treeTpopApberrelevantGrundWerte',
      tpopApberrelevantGrundWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopApberrelevantGrundWerteQuery(
            $tpopApberrelevantGrundWertsFilter: TpopApberrelevantGrundWerteFilter!
          ) {
            allTpopApberrelevantGrundWertes(
              filter: $tpopApberrelevantGrundWertsFilter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allTpopApberrelevantGrundWertes {
              totalCount
            }
          }
        `,
        variables: {
          tpopApberrelevantGrundWertsFilter:
            tpopApberrelevantGrundWerteGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.allTpopApberrelevantGrundWertes.nodes.length
  const totalCount = data.totalCount.totalCount

  const navData = {
    id: 'ApberrelevantGrundWerte',
    listFilter: 'tpopApberrelevantGrundWerte',
    url: `/Daten/Werte-Listen/ApberrelevantGrundWerte`,
    label: `Teil-Population: Grund für AP-Bericht Relevanz (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopApberrelevantGrundWerteFolder',
    treeId: `tpopApberrelevantGrundWerteFolder`,
    treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte'],
    hasChildren: !!count,
    fetcherName: 'useTpopApberrelevantGrundWertesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: data.allTpopApberrelevantGrundWertes.nodes.map(
      (p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopApberrelevantGrundWerte',
        treeId: p.id,
        treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte', p.id],
        hasChildren: false,
      }),
    ),
  }

  return navData
}
