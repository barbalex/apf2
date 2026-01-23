import { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeTpopberGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const tpopberGqlFilterForTree = useAtomValue(treeTpopberGqlFilterForTreeAtom)

  const { data, refetch } = useQuery({
    queryKey: ['treeTpopber', tpopId, tpopberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopbersQuery(
            $tpopbersFilter: TpopberFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopbersByTpopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopbersFilter: tpopberGqlFilterForTree,
          tpopId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  // react to filter changes
  useEffect(() => {
    const unsub = jotaiStore.sub(treeTpopberGqlFilterForTreeAtom, refetch)
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const count = data?.data?.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'tpopber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    menuType: 'tpopberFolder',
    treeId: `${tpopId}TpopberFolder`,
    treeParentTableId: tpopId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Kontroll-Berichte',
    ],
    hasChildren: count > 0,
    component: NodeWithList,
    menus: (data?.data?.tpopById?.tpopbersByTpopId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopber',
      treeId: p.id,
      treeParentTableId: tpopId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Kontroll-Berichte',
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
