import { useState } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useQuery } from '@apollo/client/react'
import CircularProgress from '@mui/material/CircularProgress'
import { Form, useParams } from 'react-router'

import { query } from './query.js'
import { Row } from './Row/index.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../../shared/Error.jsx'
import { FormTitle } from '../../../../shared/FormTitle/index.jsx'

import styles from './index.module.css'

export const Component = ({ refetchTab }) => {
  const { apId } = useParams()

  const { data, error, loading } = useQuery(query)
  const rows = data?.allQks?.nodes

  const [filter, setFilter] = useState('')
  const onChangeFilter = (event) => setFilter(event.target.value)

  const rowsFiltered =
    filter ?
      rows.filter((r) => {
        if (!r.titel) return false
        const rTitel = r.titel.toLowerCase ? r.titel.toLowerCase() : r.titel
        const filterValue = filter.toLowerCase ? filter.toLowerCase() : filter
        return rTitel.includes(filterValue)
      })
    : rows
  const label =
    filter ? `filtern: ${rowsFiltered.length}/${rows.length}` : 'filtern'

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <CircularProgress />
        <div className={styles.spinnerText}>lade Daten...</div>
      </div>
    )
  }
  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <FormTitle title="Qualitätskontrollen wählen" />
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <FormControl
            fullWidth
            variant="standard"
            className={styles.styledFormControl}
          >
            <InputLabel htmlFor="filter">{label}</InputLabel>
            <Input
              id="filter"
              value={filter}
              onChange={onChangeFilter}
            />
          </FormControl>
        </div>
        {rowsFiltered.map((row) => (
          <Row
            key={row.name}
            apId={apId}
            qk={row}
            refetchTab={refetchTab}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}
