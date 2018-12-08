// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateProjektByIdGql from './updateProjektById'
import mobxStoreContext from '../../../../mobxStoreContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const Projekt = ({ treeName }: { treeName: string }) => {
  const client = useApolloClient()
  const mobxStore = useContext(mobxStoreContext)
  const { activeNodeArray } = mobxStore[treeName]

  const [errors, setErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    suspend: false,
    variables: {
      id:
        activeNodeArray.length > 1
          ? activeNodeArray[1]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'projektById', {})

  /*console.log('Projekt', {
    rowName: row.name,
    loading,
    activeNodeArray: activeNodeArray.toJSON().toString(),
  })*/

  useEffect(() => setErrors({}), [row])

  const filterTable = activeNodeArray.length === 2 ? 'projekt' : 'ap'

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateProjektByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updateProjektById: {
            projekt: {
              id: row.id,
              name: field === 'name' ? value : row.name,
              __typename: 'Projekt',
            },
            __typename: 'Projekt',
          },
        },*/
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
            value={row.name}
            type="text"
            saveToDb={saveToDb}
            error={errors.name}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Projekt)
