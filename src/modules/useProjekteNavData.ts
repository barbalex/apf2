import { apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useProjekteNavData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['treeProjects'],
    queryFn: async () => {
      const projekts = await apiFetch<{ id: string; name: string | null }[]>(
        `/projekt?select=id,name&order=name`,
      )
      return { allProjekts: { nodes: projekts ?? [] } }
    },
  })

  const count = data.allProjekts?.nodes.length

  const navData = {
    id: 'projekte',
    url: '/Daten/Projekte',
    label: `Projekte (${count})`,
    menus: data.allProjekts?.nodes.map((p) => ({
      id: p?.id,
      label: p?.name,
    })),
  }

  return navData
}
