import { apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useCurrentissuesNavData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['treeCurrentissues'],
    queryFn: async () => {
      const nodes = await apiFetch<{ id: string; label: string | null }[]>(
        `/v_currentissue?select=id,label&order=sort.asc,title.asc`,
      )
      return { allCurrentissues: { nodes: nodes ?? [] } }
    },
  })

  // subtract 1 for "fehlt hier was"
  const count = (data.allCurrentissues?.nodes?.length ?? 0) - 1

  const navData = {
    id: 'Aktuelle-Fehler',
    url: `/Daten/Aktuelle-Fehler`,
    label: `Aktuelle Fehler (${count})`,
    totalCount: data.allCurrentissues?.nodes.length,
    treeNodeType: 'table',
    treeMenuType: 'currentissues',
    treeId: 'currentissueFolder',
    treeTableId: null,
    treeUrl: ['Aktuelle-Fehler'],
    fetcherName: 'useCurrentissuesNavData',
    fetcherParams: {},
    hasChildren: !!count,
    menus: data.allCurrentissues?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'currentissue',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Aktuelle-Fehler', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
