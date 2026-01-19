import { type ChangeEvent } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Checkbox2States } from '../../../../shared/Checkbox2States.tsx'
import { RadioButtonGroup } from '../../../../shared/RadioButtonGroup.tsx'
import { Select } from '../../../../shared/Select.tsx'
import { TextField } from '../../../../shared/TextField.tsx'
import { query } from './query.ts'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'

import type { EkfrequenzId } from '../../../../../models/apflora/EkfrequenzId.ts'
import type { AdresseId } from '../../../../../models/apflora/AdresseId.ts'

import styles from './index.module.css'

interface TpopEkFilterQueryResult {
  allEkfrequenzs: {
    nodes: Array<{
      id: EkfrequenzId
      code: string | null
      anwendungsfall: string | null
    }>
  }
  allAdresses: {
    nodes: Array<{
      value: AdresseId
      label: string
    }>
  }
}

interface EkProps {
  saveToDb: (event: ChangeEvent<HTMLInputElement>) => void
  row: any
  fieldErrors: Record<string, string>
}

export const Ek = ({ saveToDb, row, fieldErrors }: EkProps) => {
  const { apId } = useParams()
  const apolloClient = useApolloClient()

  const { data: dataEk } = useQuery<TpopEkFilterQueryResult>({
    queryKey: ['tpopFilterEk', apId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopEkFilterQueryResult>({
        query,
        variables: { apId },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

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
            dataSource={ekfrequenzOptions}
            label="EK-Frequenz"
            value={row.ekfrequenz}
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
          value={row.ekfKontrolleur}
          saveToDb={saveToDb}
          error={fieldErrors.ekfKontrolleur}
        />
      </div>
    </ErrorBoundary>
  )
}
