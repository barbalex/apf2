import { apiFetch } from '../../../../modules/api.ts'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { PopId } from '../../../../models/apflora/index.ts'

interface PopQueryResult {
  popById?: {
    id: PopId
    label: string | null
  }
}

export const Component = () => {
  const { popId } = useParams()

  const { data } = useSuspenseQuery({
    queryKey: ['pop', popId, 'label'],
    queryFn: async () => {
      const rows = await apiFetch<NonNullable<PopQueryResult['popById']>[]>(
        `/v_pop?id=eq.${popId}&select=id,label`,
      )
      return { popById: rows?.[0] ?? null }
    },
  })

  const label = data?.popById?.label ?? 'Population'

  return (
    <>
      <FormTitle title={`${label}: Dateien`} />
      <FilesRouter
        parentId={popId}
        parent="pop"
      />
    </>
  )
}
