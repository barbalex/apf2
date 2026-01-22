import { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkAbrechnungstypWertesNavData = () => {
  const apolloClient = useApolloClient()

  const ekAbrechnungstypWerteGqlFilterForTree = useAtomValue(
    treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  )

  const { data, refetch } = useQuery({
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
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => {
      const unsub = jotaiStore.sub(
        treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
        refetch,
      )
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
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
