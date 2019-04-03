// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import Select from '../../../shared/Select'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import queryLists from './queryLists'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
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

const enhance = compose(observer)

const Tpopkontrzaehl = ({ treeName }: { treeName: string }) => {
  const mobxStore = useContext(mobxStoreContext)
  const { refetch } = mobxStore
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 11
          ? activeNodeArray[11]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'tpopkontrzaehlById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                id: row.id,
                anzahl: field === 'anzahl' ? value : row.anzahl,
                einheit: field === 'einheit' ? value : row.einheit,
                methode: field === 'methode' ? value : row.methode,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['einheit', 'methode'].includes(field)) refetch.tpopkontrzaehls()
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
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Zählung"
          treeName={treeName}
          table="tpopkontrzaehl"
        />
        <FieldsContainer>
          <Select
            key={`${row.id}einheit`}
            name="einheit"
            value={row.einheit}
            field="einheit"
            label="Einheit"
            options={get(dataLists, 'allTpopkontrzaehlEinheitWertes.nodes', [])}
            loading={loadingLists}
            saveToDb={saveToDb}
            error={errors.einheit}
          />
          <TextField
            key={`${row.id}anzahl`}
            name="anzahl"
            label="Anzahl (nur ganze Zahlen)"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <RadioButtonGroup
            key={`${row.id}methode`}
            name="methode"
            label="Methode"
            value={row.methode}
            dataSource={get(
              dataLists,
              'allTpopkontrzaehlMethodeWertes.nodes',
              [],
            )}
            saveToDb={saveToDb}
            error={errors.methode}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopkontrzaehl)
