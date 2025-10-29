import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Checkbox2States } from '../../../../shared/Checkbox2States.jsx'
import { RadioButtonGroup } from '../../../../shared/RadioButtonGroup.jsx'
import { Select } from '../../../../shared/Select.jsx'
import { TextField } from '../../../../shared/TextField.jsx'
import { query } from './query.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../../shared/Spinner.jsx'

import { container, ekfrequenzOptionsContainer } from './index.module.css'

export const Ek = ({ saveToDb, row, fieldErrors }) => {
  const { apId } = useParams()

  const { data: dataEk, loading } = useQuery(query, {
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
      <div className={container}>
        <div className={ekfrequenzOptionsContainer}>
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
