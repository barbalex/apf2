import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'
import { RootNode } from '../components/Projekte/TreeContainer/Tree/RootNode.jsx'

export const useProjektNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId =
    props?.projId ?? params?.projId ?? 'e57f56f4-4376-11e8-ab21-4314b6749d13'

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeProject', projId],
    queryFn: () =>
      apolloClient.query({
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
          apFilter: store.tree.apGqlFilterForTree,
          apberuebersichtFilter: store.tree.apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.apberuebersichtGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.projektById?.label ?? 'Projekt'
  const artsCount = data?.data?.projektById?.apsByProjId?.totalCount ?? 0
  const allArtsCount = data?.data?.projektById?.allAps?.totalCount ?? 0
  const apberuebersichtsCount =
    data?.data?.projektById?.apberuebersichtsByProjId?.totalCount ?? 0
  const allApberuebersichtsCount =
    data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0

  const navData = useMemo(
    () => ({
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
      component: RootNode,
      menus: [
        {
          id: 'Projekt',
          label: 'Projekt',
          isSelf: true,
        },
        {
          id: 'Arten',
          label: `Arten (${isLoading ? '...' : `${artsCount}/${allArtsCount}`})`,
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
          label: `AP-Berichte (${isLoading ? '...' : `${apberuebersichtsCount}/${allApberuebersichtsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'apberuebersichtFolder',
          treeId: `${projId}/ApberuebersichtFolder`,
          treeTableId: projId,
          treeParentTableId: projId,
          treeUrl: ['Projekte', projId, 'AP-Berichte'],
          hasChildren: !!apberuebersichtsCount,
          fetcherName: 'useApberuebersichtsNavData',
          fetcherParams: { projId },
          component: NodeWithList,
        },
      ],
    }),
    [
      allApberuebersichtsCount,
      allArtsCount,
      apberuebersichtsCount,
      artsCount,
      isLoading,
      label,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
