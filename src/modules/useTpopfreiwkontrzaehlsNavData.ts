import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.ts'

export const useTpopfreiwkontrzaehlsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const store = useContext(MobxContext)

  const { data, refetch } = useQuery({
    queryKey: [
      'treeTpopfreiwkontrzaehl',
      tpopkontrId,
      store.tree.tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopfreiwkontrzaehlsQuery(
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
            $tpopkontrId: UUID!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlsFilter
                orderBy: LABEL_ASC
              ) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopkontrzaehlsFilter: store.tree.tpopkontrzaehlGqlFilterForTree,
          tpopkontrId,
        },
        fetchPolicy: 'no-cache',
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
    () => reaction(() => store.tree.tpopkontrzaehlGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const totalCount = data?.data?.tpopkontrById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Zaehlungen',
    listFilter: 'tpopkontrzaehl',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${tpopkontrId}/Zaehlungen`,
    label: `Zählungen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfreiwkontrzaehlFolder',
    treeId: `${tpopkontrId}TpopfreiwkontrzaehlFolder`,
    treeParentTableId: tpopkontrId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Freiwilligen-Kontrollen',
      tpopkontrId,
      'Zaehlungen',
    ],
    fetcherName: 'useTpopfreiwkontrzaehlsNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
    hasChildren: !!count,
    alwaysOpen: true,
    menus: (
      data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
    ).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopfreiwkontrzaehl',
      treeId: p.id,
      treeParentTableId: tpopkontrId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Freiwilligen-Kontrollen',
        tpopkontrId,
        'Zaehlungen',
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
