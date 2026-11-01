import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getTpopkontrzaehlGqlFilterForTree } from './getTpopkontrzaehlGqlFilterForTree.ts'

export const useTpopfeldkontrzaehlsNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
        tpopkontrId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId ?? ''
  const tpopkontrzaehlGqlFilterForTree =
    getTpopkontrzaehlGqlFilterForTree(tpopkontrId)

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpopfeldkontrzaehl',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the former tpopkontrzaehlsByTpopkontrId relation constraint
      // merges into the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...tpopkontrzaehlGqlFilterForTree,
        tpopkontrByTpopkontrId: {
          ...((
            tpopkontrzaehlGqlFilterForTree as {
              tpopkontrByTpopkontrId?: object
            }
          ).tpopkontrByTpopkontrId ?? {}),
          id: { equalTo: tpopkontrId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_tpopkontrzaehl?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_tpopkontrzaehl?tpopkontr_id=eq.${tpopkontrId}`),
      ])
      return {
        tpopkontrById: {
          id: tpopkontrId,
          tpopkontrzaehlsByTpopkontrId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.tpopkontrById?.tpopkontrzaehlsByTpopkontrId.nodes.length
  const totalCount = data.tpopkontrById?.totalCount.totalCount

  const navData = {
    id: 'Zaehlungen',
    listFilter: 'tpopkontrzaehl',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen`,
    label: `Zählungen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfeldkontrzaehlFolder',
    treeId: `${tpopkontrId}TpopfeldkontrzaehlFolder`,
    treeTableId: tpopkontrId,
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
      'Feld-Kontrollen',
      tpopkontrId,
      'Zaehlungen',
    ],
    fetcherName: 'useTpopfeldkontrzaehlsNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
    hasChildren: !!count,
    alwaysOpen: true,
    menus: data.tpopkontrById?.tpopkontrzaehlsByTpopkontrId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopfeldkontrzaehl',
      treeId: p?.id,
      treeTableId: p?.id,
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
        'Feld-Kontrollen',
        tpopkontrId,
        'Zaehlungen',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
