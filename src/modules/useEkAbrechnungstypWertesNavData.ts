import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store,
  treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkAbrechnungstypWertesNavData = () => {
  const apolloClient = useApolloClient()

  const ekAbrechnungstypWerteGqlFilterForTree = useAtomValue(
    treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: [
      'treeEkAbrechnungstypWerte',
      ekAbrechnungstypWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeEkAbrechnungstypWertesQuery(
            $filter: EkAbrechnungstypWerteFilter!
          ) {
            allEkAbrechnungstypWertes(
              filter: $filter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allEkAbrechnungstypWertes {
              totalCount
            }
          }
        `,
        variables: {
          filter: ekAbrechnungstypWerteGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.allEkAbrechnungstypWertes?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'EkAbrechnungstypWerte',
    listFilter: 'ekAbrechnungstypWerte',
    url: `/Daten/Werte-Listen/EkAbrechnungstypWerte`,
    label: `Teil-Population: EK-Abrechnungstypen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekAbrechnungstypWerteFolder',
    treeId: `EkAbrechnungstypWerteFolder`,
    treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte'],
    hasChildren: !!count,
    fetcherName: 'useEkAbrechnungstypWertesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: (data?.data?.allEkAbrechnungstypWertes?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'ekAbrechnungstypWerte',
      treeId: p.id,
      treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
