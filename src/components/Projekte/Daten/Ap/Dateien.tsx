import { apiFetch } from '../../../../modules/api.ts'
import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { FilesRouter } from '../../../shared/Files/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

interface ApFilesQueryResult {
  apById: {
    id: ApId
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string
    } | null
  }
}

export const Component = () => {
  const { apId } = useParams<{ apId: string }>()
  const { data } = useSuspenseQuery({
    queryKey: ['apFiles', apId],
    queryFn: async () => {
      const rows = await apiFetch<NonNullable<ApFilesQueryResult['apById']>[]>(
        `/v_ap?id=eq.${apId ?? ''}&select=id,label`,
      )
      return { apById: rows?.[0] ?? null }
    },
  })

  const artname = data.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Dateien`} />
      <FilesRouter
        parentId={apId}
        parent="ap"
      />
    </>
  )
}
