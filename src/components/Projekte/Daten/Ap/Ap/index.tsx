import { useParams } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { TextFieldNonUpdatable } from '../../../../shared/TextFieldNonUpdatable.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { Menu } from '../Menu.tsx'
import { ApUsers } from '../ApUsers/index.tsx'
import { Ap, type ApQueryResult } from './Ap.tsx'

import { apiFetch } from '../../../../../modules/api.ts'
import { apSelect } from '../../../../../modules/selects.ts'

import styles from './index.module.css'

export const Component = () => {
  const { apId } = useParams<{ apId: string }>()

  const { data } = useSuspenseQuery({
    queryKey: ['ap', apId],
    queryFn: async () => {
      const [rows, adresses, bearbstandWerte, umsetzungWerte] =
        await Promise.all([
          apiFetch<NonNullable<ApQueryResult['apById']>[]>(
            `/v_ap?id=eq.${apId}&select=${apSelect},aeTaxonomyByArtId:ae_taxonomy_by_art_id`,
          ),
          apiFetch<NonNullable<ApQueryResult['allAdresses']>['nodes']>(
            `/adresse?order=name.asc&select=value:id,label:name`,
          ),
          apiFetch<
            NonNullable<ApQueryResult['allApBearbstandWertes']>['nodes']
          >(`/ap_bearbstand_werte?order=sort.asc&select=value:code,label:text`),
          apiFetch<NonNullable<ApQueryResult['allApUmsetzungWertes']>['nodes']>(
            `/ap_umsetzung_werte?order=sort.asc&select=value:code,label:text`,
          ),
        ])
      return {
        apById: rows?.[0] ?? null,
        allAdresses: { nodes: adresses ?? [] },
        allApBearbstandWertes: { nodes: bearbstandWerte ?? [] },
        allApUmsetzungWertes: { nodes: umsetzungWerte ?? [] },
      } as ApQueryResult
    },
  })

  const row = data.apById

  return (
    <ErrorBoundary>
      <FormTitle
        title="Art"
        MenuBarComponent={Menu}
        menuBarProps={{ label: row?.label ?? null }}
      />
      <div className={styles.formContainer}>
        <Ap>
          <ApUsers />
        </Ap>
        <TextFieldNonUpdatable
          key={`${row.id}artwert`}
          label="Artwert"
          value={
            (row?.aeTaxonomyByArtId?.artwert ??
              'Diese Art hat keinen Artwert') as string
          }
        />
      </div>
    </ErrorBoundary>
  )
}
