import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeAdresseGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useAdressesNavData = () => {
  const apolloClient = useApolloClient()

  const adresseGqlFilterForTree = useAtomValue(treeAdresseGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeAdresse', adresseGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeAdressesQuery($adressesFilter: AdresseFilter!) {
            allAdresses(filter: $adressesFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allAdresses {
              totalCount
            }
          }
        `,
        variables: {
          adressesFilter: adresseGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.allAdresses?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Adressen',
    listFilter: 'adresse',
    url: `/Daten/Werte-Listen/Adressen`,
    label: `Adressen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'adresseFolder',
    treeId: `AdresseFolder`,
    treeUrl: ['Werte-Listen', 'Adressen'],
    hasChildren: !!count,
    fetcherName: 'useAdressesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: (data?.data?.allAdresses?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'adresse',
      treeId: p.id,
      treeUrl: ['Werte-Listen', 'Adressen', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
