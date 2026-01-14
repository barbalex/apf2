import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Checkbox2States } from '../../../../shared/Checkbox2States.jsx'
import { RadioButtonGroup } from '../../../../shared/RadioButtonGroup.jsx'
import { Select } from '../../../../shared/Select.jsx'
import { TextField } from '../../../../shared/TextField.tsx'
import { query } from './query.ts'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../../../shared/Spinner.tsx'

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
  saveToDb: (event: React.ChangeEvent<HTMLInputElement>) => void
  row: any
  fieldErrors: Record<string, string>
}

export const Ek = ({ saveToDb, row, fieldErrors }: EkProps) => {
  const { apId } = useParams()

  const { data: dataEk, loading } = useQuery<TpopEkFilterQueryResult>(query, {
    variables: {
      apId,
    },
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

  if (loading) return <Spinner />

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.ekfrequenzOptionsContainer}>
          <RadioButtonGroup
            name="ekfrequenz"
            dataSource={ekfrequenzOptions}
            loading={loading}
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
          loading={loading}
          value={row.ekfKontrolleur}
          saveToDb={saveToDb}
          error={fieldErrors.ekfKontrolleur}
        />
      </div>
    </ErrorBoundary>
  )
}
