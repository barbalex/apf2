import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { ApErfolg } from './ApErfolg/index.tsx'
import { PopStatus } from './PopStatus/index.tsx'
import { PopMenge } from './PopMenge/index.tsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

import { apiFetch } from '../../../../modules/api.ts'

import styles from './index.module.css'

interface ApAuswertungQueryResult {
  apById: {
    id: ApId
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string | null
    } | null
  } | null
}

export const Component = () => {
  const { apId } = useParams<{ apId: string }>()
  const { data } = useSuspenseQuery({
    queryKey: ['apAuswertung', apId],
    queryFn: async () => {
      const rows = await apiFetch<
        NonNullable<ApAuswertungQueryResult['apById']>[]
      >(`/v_ap?id=eq.${apId}&select=id,aeTaxonomyByArtId:ae_taxonomy_by_art_id`)
      return { apById: rows?.[0] ?? null } as ApAuswertungQueryResult
    },
  })

  const artname = data.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Auswertung`} />
      <div className={styles.scrollContainer}>
        <div className={styles.formContainer}>
          <ApErfolg />
          <PopStatus />
          <PopMenge />
          <TpopKontrolliert />
        </div>
      </div>
    </>
  )
}
