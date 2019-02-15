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
import updateZielberByIdGql from './updateZielberById'
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

const Zielber = ({ treeName }: { treeName: string }) => {
  const mobxStore = useContext(mobxStoreContext)
  const client = useApolloClient()
  const [errors, setErrors] = useState({})

  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 8
          ? activeNodeArray[8]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'zielberById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)
      if ([undefined, ''].includes(value)) value = null
      try {
        await client.mutate({
          mutation: updateZielberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateZielberById: {
              zielber: {
                id: row.id,
                zielId: field === 'zielId' ? value : row.zielId,
                jahr: field === 'jahr' ? value : row.jahr,
                erreichung: field === 'erreichung' ? value : row.erreichung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                zielByZielId: row.zielByZielId,
                __typename: 'Zielber',
              },
              __typename: 'Zielber',
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
          apId={get(row, 'zielByZielId.apId')}
          title="Ziel-Bericht"
          treeName={treeName}
          table="zielber"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}jahr`}
            name="jahr"
            label="Jahr"
            value={row.jahr}
            type="number"
            saveToDb={saveToDb}
            error={errors.jahr}
          />
          <TextField
            key={`${row.id}erreichung`}
            name="erreichung"
            label="Ziel-Erreichung"
            value={row.erreichung}
            type="text"
            saveToDb={saveToDb}
            error={errors.erreichung}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen"
            value={row.bemerkungen}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.bemerkungen}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Zielber)
