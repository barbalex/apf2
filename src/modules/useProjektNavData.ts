import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
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

  const { data } = useQuery({
    queryKey: [
      'treeProject',
      projId,
      apGqlFilterForTree,
      apberuebersichtGqlFilterForTree,
    ],
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
              filteredApberuebersichts: apberuebersichtsByProjId(
                filter: $apberuebersichtFilter
              ) {
                totalCount
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
              filteredAps: apsByProjId(filter: $apFilter) {
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
      return result.data
    },
    suspense: true,
  })

  const label = data.projektById.label ?? 'Projekt'
  const artsCount = data.projektById.filteredAps.totalCount
  const allArtsCount = data.projektById.allAps.totalCount
  const apberuebersichtsCount =
    data.projektById.filteredApberuebersichts.totalCount
  const allApberuebersichtsCount =
    data.projektById.allApberuebersichts.totalCount
  const navData = {
    id: projId,
    url: `/Daten/Projekte/${projId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'projekt',
    treeId: projId,
    treeTableId: projId,
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
        treeTableId: projId,
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
        treeTableId: projId,
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
