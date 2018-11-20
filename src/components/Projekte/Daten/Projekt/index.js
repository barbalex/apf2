// @flow
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateProjektByIdGql from './updateProjektById'

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
)

const Projekt = ({
  id,
  treeName,
  activeNodeArray,
  data,
  client,
}: {
  id: string,
  treeName: string,
  activeNodeArray: Array<string>,
  data: Object,
  client: Object,
}) => {
  if (data.loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (data.error) return `Fehler: ${data.error.message}`

  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [id])

  const row = get(data, 'projektById', {})
  const filterTable = activeNodeArray.length === 2 ? 'projekt' : 'ap'

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
          mutation: updateProjektByIdGql,
          variables: {
            id: row.id,
            [field]: value,
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
    [id],
  )

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

export default enhance(Projekt)
