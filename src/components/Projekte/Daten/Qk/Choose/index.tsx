import { useState, type ChangeEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { Form, useParams } from 'react-router'

import { query } from './query.ts'
import { Row } from './Row/index.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'

import type { QkName } from '../../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
  sort: number | null
}

interface QkChooseQueryResult {
  allQks?: {
    totalCount: number
    nodes: QkNode[]
  }
}

interface ChooseProps {
  refetchTab?: () => void
}

export const Component = ({ refetchTab }: ChooseProps) => {
  const { apId } = useParams()
  const apolloClient = useApolloClient()

  const { data } = useQuery<QkChooseQueryResult>({
    queryKey: ['qkChoose'],
    queryFn: async () => {
      const result = await apolloClient.query<QkChooseQueryResult>({
        query,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const rows = data?.allQks?.nodes

  const [filter, setFilter] = useState('')
  const onChangeFilter = (event: ChangeEvent<HTMLInputElement>) =>
    setFilter(event.target.value)

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
