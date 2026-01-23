import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store,
  treeApberuebersichtGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useApberuebersichtsNavData = (props) => {
  const apolloClient = useApolloClient()

  const params = useParams()
  const projId = props?.projId ?? params?.projId

  const apberuebersichtGqlFilterForTree = useAtomValue(
    treeApberuebersichtGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treeApberuebersicht', apberuebersichtGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavApberuebersichtsQuery(
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            filtered: allApberuebersichts(
              filter: $apberuebersichtFilter
              orderBy: LABEL_ASC
            ) {
              totalCount
              nodes {
                id
                label
              }
            }
            unfiltered: allApberuebersichts {
              totalCount
            }
          }
        `,
        variables: {
          apberuebersichtFilter: apberuebersichtGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.filtered?.nodes?.length ?? 0
  const totalCount = data?.data?.unfiltered?.totalCount ?? 0

  const navData = {
    id: 'AP-Berichte',
    listFilter: 'apberuebersicht',
    url: `/Daten/Projekte/${projId}/AP-Berichte`,
    label: 'AP-Berichte ' + `${count}/${totalCount}`,
    treeNodeType: 'folder',
    treeMenuType: 'apberuebersichtFolder',
    treeId: `${projId}/ApberuebersichtFolder`,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: !!count,
    fetcherName: 'useApberuebersichtsNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: (data?.data?.filtered?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'apberuebersicht',
      treeId: p.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'AP-Berichte', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
