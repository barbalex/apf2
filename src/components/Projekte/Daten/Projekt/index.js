// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'

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
  withData,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ setErrors, errors, data }) => async event => {
      const field = event.target.name
      const value = event.target.value || null
      const row = get(data, 'projektById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
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
  }),
  withLifecycle({
    onDidUpdate(prevProps, props) {
      if (prevProps.id !== props.id) {
        props.setErrors({})
      }
    },
  }),
)

const Projekt = ({
  saveToDb,
  id,
  errors,
  treeName,
  activeNodeArray,
  data,
}: {
  saveToDb: () => void,
  id: string,
  errors: Object,
  treeName: string,
  activeNodeArray: Array<string>,
  data: Object,
}) => {
  if (data.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`

  const row = get(data, 'projektById', {})
  const filterTable = activeNodeArray.length === 2 ? 'projekt' : 'ap'

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
