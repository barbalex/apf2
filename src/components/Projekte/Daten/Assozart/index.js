import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import TextField from '../../../shared/TextField2'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateAssozartByIdGql from './updateAssozartById'
import query from './query'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const Assozart = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'assozartById', {})

  useEffect(() => setErrors({}), [row])

  // do not include already choosen assozarten
  const assozartenOfAp = get(row, 'apByApId.assozartsByApId.nodes', [])
    .map(o => o.aeId)
    // but do include the art included in the row
    .filter(o => o !== row.aeId)
  const aeEigenschaftenfilter = inputValue =>
    !!inputValue
      ? assozartenOfAp.length
        ? {
            artname: { includesInsensitive: inputValue },
            id: { notIn: assozartenOfAp },
          }
        : { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateAssozartByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateAssozartById: {
              assozart: {
                id: row.id,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                aeId: field === 'aeId' ? value : row.aeId,
                apId: field === 'apId' ? value : row.apId,
                aeEigenschaftenByAeId: row.aeEigenschaftenByAeId,
                apByApId: row.apByApId,
                __typename: 'Assozart',
              },
              __typename: 'Assozart',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['aeId'].includes(field)) refetch.assozarts()
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
      <Container data-id="assozart">
        <FormTitle
          apId={row.apId}
          title="assoziierte Art"
          treeName={treeName}
          table="assozart"
        />
        <FieldsContainer>
          <SelectLoadingOptions
            key={`${row.id}aeId2`}
            field="aeId"
            valueLabelPath="aeEigenschaftenByAeId.artname"
            label="Art"
            row={row}
            saveToDb={saveToDb}
            error={errors.aeId}
            query={queryAeEigenschaftens}
            filter={aeEigenschaftenfilter}
            queryNodesName="allAeEigenschaftens"
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Bemerkungen zur Assoziation"
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

export default observer(Assozart)
