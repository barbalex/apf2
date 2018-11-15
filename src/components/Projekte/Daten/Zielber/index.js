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
import updateZielberByIdGql from './updateZielberById'

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
      let value = event.target.value
      if (value === undefined) value = null
      const row = get(data, 'zielberById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
          mutation: updateZielberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
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

const Zielber = ({
  id,
  saveToDb,
  errors,
  treeName,
  data,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  data: Object,
}) => {
  if (data.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`

  const row = get(data, 'zielberById', {})

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
            label="Entwicklung"
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

export default enhance(Zielber)
