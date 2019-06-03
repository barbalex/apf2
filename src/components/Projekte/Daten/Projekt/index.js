import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import updateProjektByIdGql from './updateProjektById'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Projekt = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

  const [errors, setErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 1
          ? activeNodeArray[1]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'projektById', {})

  useEffect(() => setErrors({}), [row])

  const filterTable = activeNodeArray.length === 2 ? 'projekt' : 'ap'

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateProjektByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateProjektById: {
              projekt: {
                id: row.id,
                name: field === 'name' ? value : row.name,
                __typename: 'Projekt',
              },
              __typename: 'Projekt',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
    },
    [row],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Projekt" treeName={treeName} table={filterTable} />
        <FieldsContainer>
          <TextField
            key={`${row.id}name`}
            name="name"
            label="Name"
            row={row}
            type="text"
            saveToDb={saveToDb}
            errors={errors}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Projekt)
