import type { SaveToDbEvent } from '../../../../shared/types.ts'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { apiFetch } from '../../../../../modules/api.ts'

import { Checkbox2States } from '../../../../shared/Checkbox2States.tsx'
import { RadioButtonGroup } from '../../../../shared/RadioButtonGroup.tsx'
import { Select } from '../../../../shared/Select.tsx'
import { TextField } from '../../../../shared/TextField.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'

import type {
  EkfrequenzId,
  AdresseId,
} from '../../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface TpopEkFilterQueryResult {
  allEkfrequenzs: {
    nodes: {
      id: EkfrequenzId
      code: string | null
      anwendungsfall: string | null
    }[]
  }
  allAdresses: {
    nodes: {
      value: AdresseId
      label: string
    }[]
  }
}

interface EkRow {
  id?: string
  ekfrequenz?: string | null
  ekfrequenzAbweichend?: boolean | null
  ekfrequenzStartjahr?: number | null
  ekfKontrolleur?: string | null
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopEkFilterUseQueryOptions = UseQueryOptions<
  TpopEkFilterQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

interface EkProps {
  saveToDb: (event: SaveToDbEvent) => void
  row: EkRow | undefined
  fieldErrors: Record<string, string>
}

export const Ek = ({ saveToDb, row, fieldErrors }: EkProps) => {
  const { apId } = useParams()

  const tpopEkFilterQueryOptions: TpopEkFilterUseQueryOptions = {
    queryKey: ['tpopFilterEk', apId],
    queryFn: async () => {
      // the old usersByAdresseIdExist reverse relation becomes an
      // id in-list of the users' adresse_ids
      const usersWithAdresse = await apiFetch<{ adresse_id: string }[]>(
        `/user?select=adresse_id&adresse_id=not.is.null`,
      )
      const adresseIds = [
        ...new Set((usersWithAdresse ?? []).map((u) => u.adresse_id)),
      ]
      const [ekfrequenzs, adresses] = await Promise.all([
        apiFetch<
          NonNullable<TpopEkFilterQueryResult['allEkfrequenzs']>['nodes']
        >(
          `/q_ekfrequenz?ap_id=eq.${apId}&select=id,code,anwendungsfall&order=sort.asc`,
        ),
        apiFetch<NonNullable<TpopEkFilterQueryResult['allAdresses']>['nodes']>(
          `/v_adresse?id=in.(${adresseIds.join(',')})&select=value:id,label:name&order=name.asc`,
        ),
      ])
      return {
        allEkfrequenzs: { nodes: ekfrequenzs ?? [] },
        allAdresses: { nodes: adresses ?? [] },
      } as TpopEkFilterQueryResult
    },
    suspense: true,
  }
  const { data: dataEk } = useQuery(tpopEkFilterQueryOptions)

  const ekfrequenzOptions0 = dataEk?.allEkfrequenzs?.nodes ?? []
  const longestAnwendungsfall = Math.max(
    ...ekfrequenzOptions0.map((a) => (a.anwendungsfall || '').length),
  )
  const ekfrequenzOptions = ekfrequenzOptions0.map((o) => {
    const code = (o.code || '').padEnd(8)
    const anwendungsfall =
      `${(o.anwendungsfall || '').padEnd(longestAnwendungsfall)}` || ''
    return {
      value: o.id,
      label: `${code}: ${anwendungsfall}`,
    }
  })

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.ekfrequenzOptionsContainer}>
          <RadioButtonGroup
            name="ekfrequenz"
            dataSource={ekfrequenzOptions as never[]}
            label="EK-Frequenz"
            value={row.ekfrequenz as null}
            saveToDb={saveToDb}
            error={fieldErrors.ekfrequenz}
          />
        </div>
        <Checkbox2States
          name="ekfrequenzAbweichend"
          label="EK-Frequenz abweichend"
          value={row.ekfrequenzAbweichend}
          saveToDb={saveToDb}
          error={fieldErrors.ekfrequenzAbweichend}
          helperText=""
        />
        <TextField
          name="ekfrequenzStartjahr"
          label="Startjahr"
          type="number"
          value={row.ekfrequenzStartjahr}
          saveToDb={saveToDb}
          error={fieldErrors.ekfrequenzStartjahr}
        />
        <Select
          key={`${row?.id}ekfKontrolleur`}
          name="ekfKontrolleur"
          label="EKF-KontrolleurIn (nur Adressen mit zugeordnetem Benutzer-Konto)"
          options={dataEk?.allAdresses?.nodes ?? []}
          value={row.ekfKontrolleur ?? null}
          saveToDb={saveToDb}
          error={fieldErrors.ekfKontrolleur ?? ''}
        />
      </div>
    </ErrorBoundary>
  )
}
