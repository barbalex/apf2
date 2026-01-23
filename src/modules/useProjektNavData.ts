import { useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeApGqlFilterForTreeAtom,
  treeApberuebersichtGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useProjektNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId =
    props?.projId ?? params?.projId ?? 'e57f56f4-4376-11e8-ab21-4314b6749d13'

  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)
  const apberuebersichtGqlFilterForTree = useAtomValue(
    treeApberuebersichtGqlFilterForTreeAtom,
  )

  const { data, refetch } = useQuery({
    queryKey: ['treeProject', projId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavProjectQuery(
            $projId: UUID!
            $apFilter: ApFilter!
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            projektById(id: $projId) {
              id
              label
              apberuebersichtsByProjId(filter: $apberuebersichtFilter) {
                totalCount
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
              apsByProjId(filter: $apFilter) {
                totalCount
              }
              allAps: apsByProjId {
                totalCount
              }
            }
          }
        `,
        variables: {
          projId,
          apFilter: apGqlFilterForTree,
          apberuebersichtFilter: apberuebersichtGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  useEffect(() => {
    const unsub = jotaiStore.sub(treeApGqlFilterForTreeAtom, refetch)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = jotaiStore.sub(
      treeApberuebersichtGqlFilterForTreeAtom,
      refetch,
    )
    return unsub
  }, [])

  const label = data?.data?.projektById?.label ?? 'Projekt'
  const artsCount = data?.data?.projektById?.apsByProjId?.totalCount ?? 0
  const allArtsCount = data?.data?.projektById?.allAps?.totalCount ?? 0
  const apberuebersichtsCount =
    data?.data?.projektById?.apberuebersichtsByProjId?.totalCount ?? 0
  const allApberuebersichtsCount =
    data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0

  const navData = {
    id: projId,
    url: `/Daten/Projekte/${projId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'projekt',
    treeId: projId,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId],
    hasChildren: true,
    fetcherName: 'useProjektNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: [
      {
        id: 'Projekt',
        label: 'Projekt',
        isSelf: true,
      },
      {
        id: 'Arten',
        label: `Arten (${artsCount}/${allArtsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apFolder',
        treeId: `${projId}/ApFolder`,
        treeParentTableId: projId,
        treeUrl: ['Projekte', projId, 'Arten'],
        hasChildren: !!artsCount,
        fetcherName: 'useApsNavData',
        fetcherParams: { projId },
        component: NodeWithList,
      },
      {
        id: 'AP-Berichte',
        label: `AP-Berichte (${apberuebersichtsCount}/${allApberuebersichtsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apberuebersichtFolder',
        treeId: `${projId}ApberuebersichtFolder`,
        treeParentTableId: projId,
        treeUrl: ['Projekte', projId, 'AP-Berichte'],
        hasChildren: !!apberuebersichtsCount,
        fetcherName: 'useApberuebersichtsNavData',
        fetcherParams: { projId },
        component: NodeWithList,
      },
    ],
  }

  return navData
}
