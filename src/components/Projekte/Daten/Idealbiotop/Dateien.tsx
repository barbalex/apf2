import { apiFetch } from '../../../../modules/api.ts'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { IdealbiotopId } from '../../../../models/apflora/index.ts'

interface IdealbiotopNode {
  id: IdealbiotopId
}

export const Component = () => {
  const { apId } = useParams()

  const { data } = useSuspenseQuery({
    queryKey: ['idealbiotop', apId],
    queryFn: async () => {
      const rows = await apiFetch<IdealbiotopNode[]>(
        `/idealbiotop?ap_id=eq.${apId}&select=id,ap_id`,
      )
      return { allIdealbiotops: { nodes: rows ?? [] } }
    },
  })

  const row: Partial<IdealbiotopNode> = data?.allIdealbiotops?.nodes?.[0] ?? {}

  return (
    <>
      <FormTitle title="Dateien" />
      <FilesRouter
        parentId={row.id}
        parent="idealbiotop"
      />
    </>
  )
}
