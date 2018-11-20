// @flow
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateErfkritByIdGql from './updateErfkritById'
import withAllApErfkritWertes from './withAllApErfkritWertes'

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
  withApollo,
  withData,
  withAllApErfkritWertes,
)

const Erfkrit = ({
  id,
  treeName,
  dataAllApErfkritWertes,
  data,
  client,
  refetchTree,
}: {
  id: string,
  treeName: string,
  dataAllApErfkritWertes: Object,
  data: Object,
  client: Object,
  refetchTree: () => void,
}) => {
  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [id])

  const row = get(data, 'erfkritById', {})
  let erfolgWerte = get(dataAllApErfkritWertes, 'allApErfkritWertes.nodes', [])
  erfolgWerte = sortBy(erfolgWerte, 'sort')
  erfolgWerte = erfolgWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = event.target.value || null
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await client.mutate({
          mutation: updateErfkritByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
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
        },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['erfolg'].includes(field)) refetchTree('erfkrits')
    },
    [id],
  )

  if (data.loading || dataAllApErfkritWertes.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`
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
