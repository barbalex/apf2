import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useApberuebersichtsNavData = (props) => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)

  const params = useParams()
  const projId = props?.projId ?? params?.projId

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeApberuebersicht', projId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApberuebersichtsQuery(
            $projId: UUID!
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            projektById(id: $projId) {
              id
              apberuebersichtsByProjId(
                filter: $apberuebersichtFilter
                orderBy: LABEL_ASC
              ) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
            }
          }
        `,
        variables: {
          projId,
          apberuebersichtFilter: store.tree.apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.apberuebersichtGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count =
    data?.data?.projektById?.apberuebersichtsByProjId?.nodes?.length ?? 0
  const totalCount =
    data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0

  const navData = {
    id: 'AP-Berichte',
    listFilter: 'apberuebersicht',
    url: `/Daten/Projekte/${projId}/AP-Berichte`,
    label: 'AP-Berichte ' + (isLoading ? '...' : `${count}/${totalCount}`),
    treeNodeType: 'folder',
    treeMenuType: 'apberuebersichtFolder',
    treeId: `${projId}/ApberuebersichtFolder`,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: !!count,
    fetcherName: 'useApberuebersichtsNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: (data?.data?.projektById?.apberuebersichtsByProjId?.nodes ?? []).map(
      (p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'apberuebersicht',
        treeId: p.id,
        treeParentTableId: projId,
        treeUrl: ['Projekte', projId, 'AP-Berichte', p.id],
        hasChildren: false,
      }),
    ),
  }

  return { isLoading, error, navData }
}
