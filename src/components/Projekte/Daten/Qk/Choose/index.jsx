import { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { useQuery } from '@apollo/client'
import CircularProgress from '@mui/material/CircularProgress'
import { Form, useParams } from 'react-router'

import { query } from './query.js'
import { Row } from './Row/index.jsx'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../../shared/Error.jsx'
import { FormTitle } from '../../../../shared/FormTitle/index.jsx'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`
const SpinnerContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const SpinnerText = styled.div`
  padding: 10px;
`
const FilterContainer = styled.div`
  padding: 0 60px;
`
const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

export const Component = ({ refetchTab }) => {
  const { apId } = useParams()

  const { data, error, loading } = useQuery(query)
  const rows = data?.allQks?.nodes

  const [filter, setFilter] = useState('')
  const onChangeFilter = useCallback(
    (event) => setFilter(event.target.value),
    [],
  )
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
      <SpinnerContainer>
        <CircularProgress />
        <SpinnerText>lade Daten...</SpinnerText>
      </SpinnerContainer>
    )
  }
  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <FormTitle title="Qualitätskontrollen wählen" />
      <Container>
        <FilterContainer>
          <StyledFormControl
            fullWidth
            variant="standard"
          >
            <InputLabel htmlFor="filter">{label}</InputLabel>
            <Input
              id="filter"
              value={filter}
              onChange={onChangeFilter}
            />
          </StyledFormControl>
        </FilterContainer>
        {rowsFiltered.map((row) => (
          <Row
            key={row.name}
            apId={apId}
            qk={row}
            refetchTab={refetchTab}
          />
        ))}
      </Container>
    </ErrorBoundary>
  )
}
