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
import updatePopmassnberByIdGql from './updatePopmassnberById'
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
      const value = event.target.value || null
      const row = get(data, 'popmassnberById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
          mutation: updatePopmassnberByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
            __typename: 'Mutation',
            updatePopmassnberById: {
              popmassnber: {
                id: row.id,
                popId: field === 'popId' ? value : row.popId,
                jahr: field === 'jahr' ? value : row.jahr,
                beurteilung: field === 'beurteilung' ? value : row.beurteilung,
                bemerkungen: field === 'bemerkungen' ? value : row.bemerkungen,
                tpopmassnErfbeurtWerteByBeurteilung:
                  row.tpopmassnErfbeurtWerteByBeurteilung,
                popByPopId: row.popByPopId,
                __typename: 'Popmassnber',
              },
              __typename: 'Popmassnber',
            },
          },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['beurteilung'].includes(field)) refetchTree('popmassnbers')
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

const Popmassnber = ({
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

  const row = get(data, 'popmassnberById', {})
  let popbeurteilungWerte = get(
    dataAllTpopmassnErfbeurtWertes,
    'allTpopmassnErfbeurtWertes.nodes',
    [],
  )
  popbeurteilungWerte = sortBy(popbeurteilungWerte, 'sort')
  popbeurteilungWerte = popbeurteilungWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(data, 'popmassnberById.popByPopId.apId')}
          title="Massnahmen-Bericht Population"
          treeName={treeName}
          table="popmassnber"
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
            key={`${row.id}beurteilung`}
            name="beurteilung"
            label="Entwicklung"
            value={row.beurteilung}
            dataSource={popbeurteilungWerte}
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

export default enhance(Popmassnber)
