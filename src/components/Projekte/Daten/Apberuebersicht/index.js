import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateApberuebersichtByIdGql from './updateApberuebersichtById'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  height: 100%;
  padding: 10px;
  height: 100%;
`

const Apberuebersicht = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'apberuebersichtById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateApberuebersichtByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateApberuebersichtById: {
              apberuebersicht: {
                id: row.id,
                projId: field === 'projId' ? value : row.projId,
                jahr: field === 'jahr' ? value : row.jahr,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                __typename: 'Apberuebersicht',
              },
              __typename: 'Apberuebersicht',
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
        <FormTitle
          title="AP-Bericht Jahresübersicht"
          treeName={treeName}
          table="apberuebersicht"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
            row={row}
            type="text"
            multiLine
            saveToDb={saveToDb}
            errors={errors}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Apberuebersicht)
