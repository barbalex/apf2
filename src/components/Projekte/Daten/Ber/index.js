// @flow
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import { withApollo } from 'react-apollo'

import TextField from '../../../shared/TextField'
import TextFieldWithUrl from '../../../shared/TextFieldWithUrl'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateBerByIdGql from './updateBerById'

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

const Ber = ({
  id,
  treeName,
  data,
  client,
}: {
  id: string,
  treeName: string,
  data: Object,
  client: Object,
}) => {
  if (data.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`

  const [errors, setErrors] = useState({})

  useEffect(() => setErrors({}), [id])

  const row = get(data, 'berById', {})

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
          mutation: updateBerByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
          __typename: 'Mutation',
          updateBerById: {
            ber: {
              id: row.id,
              apId: field === 'apId' ? value : row.apId,
              autor: field === 'autor' ? value : row.autor,
              jahr: field === 'jahr' ? value : row.jahr,
              titel: field === 'titel' ? value : row.titel,
              url: field === 'url' ? value : row.url,
              __typename: 'Ber',
            },
            __typename: 'Ber',
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
        <FormTitle
          apId={row.apId}
          title="Bericht"
          treeName={treeName}
          table="ber"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}autor`}
            name="autor"
            label="AutorIn"
            value={row.autor}
            type="text"
            saveToDb={saveToDb}
            error={errors.autor}
          />
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
            key={`${row.id}titel`}
            name="titel"
            label="Titel"
            value={row.titel}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.titel}
          />
          <TextFieldWithUrl
            key={`${row.id}url`}
            name="url"
            label="URL"
            value={row.url}
            type="text"
            multiLine
            saveToDb={saveToDb}
            error={errors.url}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Ber)
