import { apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useZielNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        jahr?: string | undefined
        zielId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const jahr = props?.jahr ?? params.jahr ?? ''
  const zielId = props?.zielId ?? params.zielId ?? ''

  const { data } = useSuspenseQuery({
    queryKey: ['treeZiel', zielId],
    queryFn: async () => {
      const ziels = await apiFetch<{ id: string; label: string | null }[]>(
        `/q_ziel?id=eq.${zielId}&select=id,label`,
      )
      return { zielById: ziels?.[0] ?? null }
    },
  })

  const navData = {
    id: zielId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}`,
    label: data.zielById?.label ?? '(nicht beschrieben)',
    treeNodeType: 'table',
    treeMenuType: 'ziel',
    treeId: zielId,
    treeTableId: zielId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, zielId],
    fetcherName: 'useZielNavData',
    fetcherParams: { projId, apId, jahr, zielId },
    hasChildren: false,
    menus: [
      {
        id: 'Ziel',
        label: 'Ziel',
        isSelf: true,
      },
    ],
  }

  return navData
}
