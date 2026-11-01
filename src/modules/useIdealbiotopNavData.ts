import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useIdealbiotopNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  const { data } = useSuspenseQuery({
    queryKey: ['treeIdealbiotop', apId],
    queryFn: async () => {
      const [aps, idealbiotops] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/q_ap?id=eq.${apId}&select=id,label`,
        ),
        apiFetch<{ id: string }[]>(
          `/idealbiotop?ap_id=eq.${apId}&select=id&order=id`,
        ),
      ])
      const idealbiotopId = idealbiotops?.[0]?.id
      const filesCount =
        idealbiotopId ?
          await apiCount(`/idealbiotop_file?idealbiotop_id=eq.${idealbiotopId}`)
        : 0
      return {
        apById: {
          id: apId,
          label: aps?.[0]?.label,
          idealbiotopsByApId: {
            nodes: [
              {
                id: idealbiotopId,
                idealbiotopFilesByIdealbiotopId: { totalCount: filesCount },
              },
            ],
          },
        },
      }
    },
  })

  const idealbiotop = data.apById?.idealbiotopsByApId?.nodes?.[0]
  const filesCount =
    idealbiotop?.idealbiotopFilesByIdealbiotopId?.totalCount ?? 0

  const navData = {
    id: 'Idealbiotop',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Idealbiotop`,
    label: 'Idealbiotop',
    treeNodeType: 'folder',
    treeMenuType: 'idealbiotopFolder',
    treeId: `${apId}IdealbiotopFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop'],
    hasChildren: true,
    fetcherName: 'useIdealbiotopNavData',
    fetcherParams: { projId, apId },
    menus: [
      {
        id: 'Idealbiotop',
        label: `Idealbiotop`,
        isSelf: true,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        count: filesCount,
        treeNodeType: 'folder',
        treeMenuType: 'idealbiotopDateienFolder',
        treeId: `${apId}IdealbiotopDateienFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop', 'Dateien'],
        hasChildren: false,
      },
    ],
  }

  return navData
}
