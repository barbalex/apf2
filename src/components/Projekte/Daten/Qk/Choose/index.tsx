import { useState, type ChangeEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { apiFetch } from '../../../../../modules/api.ts'

import { Row } from './Row/index.tsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'

import type { ApId, QkName } from '../../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
  sort: number | null
}

interface QkChooseQueryResult {
  allQks: {
    totalCount: number
    nodes: QkNode[]
  }
}

interface ChooseProps {
  refetchTab?: () => void
}

export const Component = ({ refetchTab }: ChooseProps) => {
  const { apId } = useParams()

  // options are kept in a variable because suspense is still honoured by
  // react-query at runtime but was removed from useQuery's types in v5
  const queryOptions = {
    queryKey: ['qkChoose'],
    queryFn: async () => {
      const qks =
        (await apiFetch<
          {
            name: string
            titel: string | null
            beschreibung: string | null
            sort: number | null
          }[]
        >(`/qk?select=name,titel,beschreibung,sort&order=sort.asc,name.asc`)) ??
        []
      return {
        allQks: { nodes: qks, totalCount: qks.length },
      } as unknown as QkChooseQueryResult
    },
    suspense: true,
  }
  const { data } = useQuery(queryOptions)
  const rows = data?.allQks?.nodes ?? []

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
            apId={apId as ApId}
            qk={row}
            refetchTab={refetchTab}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}
