// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './data'
import updateErfkritByIdGql from './updateErfkritById'
import withAllApErfkritWertes from './withAllApErfkritWertes'
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

const enhance = compose(
  withAllApErfkritWertes,
  observer,
)

const Erfkrit = ({
  treeName,
  dataAllApErfkritWertes,
}: {
  treeName: string,
  dataAllApErfkritWertes: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { refetch } = mobxStore
  const client = useApolloClient()
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = mobxStore[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'erfkritById', {})

  useEffect(() => setErrors({}), [row])

  let erfolgWerte = get(dataAllApErfkritWertes, 'allApErfkritWertes.nodes', [])
  erfolgWerte = sortBy(erfolgWerte, 'sort')
  erfolgWerte = erfolgWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value) || null
      try {
        await client.mutate({
          mutation: updateErfkritByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: mobxStore.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateErfkritById: {
              erfkrit: {
                id: row.id,
                apId: field === 'apId' ? value : row.apId,
                erfolg: field === 'erfolg' ? value : row.erfolg,
                kriterien: field === 'kriterien' ? value : row.kriterien,
                __typename: 'Erfkrit',
              },
              __typename: 'Erfkrit',
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['erfolg'].includes(field)) refetch.erfkrits()
    },
    [row],
  )

  if (loading || dataAllApErfkritWertes.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`
  if (dataAllApErfkritWertes.error) {
    return `Fehler: ${dataAllApErfkritWertes.error.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Erfolgs-Kriterium"
          treeName={treeName}
          table="erfkrit"
        />
        <FieldsContainer>
          <RadioButtonGroup
            key={`${row.id}erfolg`}
            name="erfolg"
            label="Beurteilung"
            value={row.erfolg}
            dataSource={erfolgWerte}
            saveToDb={saveToDb}
            error={errors.erfolg}
          />
          <TextField
            key={`${row.id}kriterien`}
            name="kriterien"
            label="Kriterien"
            value={row.kriterien}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.kriterien}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Erfkrit)
