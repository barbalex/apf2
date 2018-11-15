// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateTpopmassnberByIdGql from './updateTpopmassnberById'
import withAllTpopmassnErfbeurtWertes from './withAllTpopmassnErfbeurtWertes'

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
  withAllTpopmassnErfbeurtWertes,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors, data }) => async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      const row = get(data, 'tpopmassnberById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
          mutation: updateTpopmassnberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
            __typename: 'Mutation',
            updateTpopmassnberById: {
              tpopmassnber: {
                id: row.id,
                tpopId: field === 'tpopId' ? value : row.tpopId,
                jahr: field === 'jahr' ? value : row.jahr,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopByTpopId: row.tpopByTpopId,
                __typename: 'Tpopmassnber',
              },
              __typename: 'Tpopmassnber',
            },
          },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['beurteilung'].includes(field)) refetchTree('tpopmassnbers')
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

const Tpopmassnber = ({
  id,
  saveToDb,
  errors,
  treeName,
  dataAllTpopmassnErfbeurtWertes,
  data,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  dataAllTpopmassnErfbeurtWertes: Object,
  data: Object,
}) => {
  if (data.loading || dataAllTpopmassnErfbeurtWertes.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`
  if (dataAllTpopmassnErfbeurtWertes.error)
    return `Fehler: ${dataAllTpopmassnErfbeurtWertes.error.message}`

  const row = get(data, 'tpopmassnberById', {})
  let tpopmassnbeurtWerte = get(
    dataAllTpopmassnErfbeurtWertes,
    'allTpopmassnErfbeurtWertes.nodes',
    [],
  )
  tpopmassnbeurtWerte = sortBy(tpopmassnbeurtWerte, 'sort')
  tpopmassnbeurtWerte = tpopmassnbeurtWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'tpopmassnberById.tpopByTpopId.popByPopId.apId')}
          title="Massnahmen-Bericht Teil-Population"
          treeName={treeName}
          table="tpopmassnber"
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
          <RadioButtonGroup
            label="Entwicklung"
            name="beurteilung"
            value={row.beurteilung}
            dataSource={tpopmassnbeurtWerte}
            saveToDb={saveToDb}
            error={errors.beurteilung}
          />
          <TextField
            key={`${row.id}bemerkungen`}
            name="bemerkungen"
            label="Interpretation"
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

export default enhance(Tpopmassnber)
