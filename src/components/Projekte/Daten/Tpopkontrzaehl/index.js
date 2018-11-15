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
import Select from '../../../shared/Select'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withData from './withData'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import withAllTpopkontrzaehlEinheitWertes from './withAllTpopkontrzaehlEinheitWertes'

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
  withAllTpopkontrzaehlEinheitWertes,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors, data }) => async event => {
      const field = event.target.name
      let value = event.target.value
      if (value === undefined) value = null
      const row = get(data, 'tpopkontrzaehlById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await app.client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                id: row.id,
                anzahl: field === 'anzahl' ? value : row.anzahl,
                einheit: field === 'einheit' ? value : row.einheit,
                methode: field === 'methode' ? value : row.methode,
                tpopkontrzaehlEinheitWerteByEinheit:
                  row.tpopkontrzaehlEinheitWerteByEinheit,
                tpopkontrzaehlMethodeWerteByMethode:
                  row.tpopkontrzaehlMethodeWerteByMethode,
                tpopkontrByTpopkontrId: row.tpopkontrByTpopkontrId,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
            },
          },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['einheit', 'methode'].includes(field)) refetchTree('tpopkontrzaehls')
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

const Tpopkontrzaehl = ({
  id,
  saveToDb,
  errors,
  treeName,
  dataAllTpopkontrzaehlEinheitWertes,
  data,
}: {
  id: string,
  saveToDb: () => void,
  errors: Object,
  treeName: string,
  dataAllTpopkontrzaehlEinheitWertes: Object,
  data: Object,
}) => {
  if (data.loading || dataAllTpopkontrzaehlEinheitWertes.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`
  if (dataAllTpopkontrzaehlEinheitWertes.error)
    return `Fehler: ${dataAllTpopkontrzaehlEinheitWertes.error.message}`

  const row = get(data, 'tpopkontrzaehlById', {})
  let zaehleinheitWerte = get(
    dataAllTpopkontrzaehlEinheitWertes,
    'allTpopkontrzaehlEinheitWertes.nodes',
    [],
  )
  zaehleinheitWerte = sortBy(zaehleinheitWerte, 'sort').map(el => ({
    value: el.code,
    label: el.text,
  }))
  let methodeWerte = get(data, 'allTpopkontrzaehlMethodeWertes.nodes', [])
  methodeWerte = sortBy(methodeWerte, 'sort')
  methodeWerte = methodeWerte.map(el => ({
    value: el.code,
    label: el.text,
  }))

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={get(
            data,
            'tpopkontrzaehlById.tpopkontrByTpopkontrId.tpopByTpopId.popByPopId.apId',
          )}
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
            options={zaehleinheitWerte}
            saveToDb={saveToDb}
            error={errors.einheit}
          />
          <TextField
            key={`${row.id}anzahl`}
            name="anzahl"
            label="Anzahl (nur ganze Zahlen)"
            value={row.anzahl}
            type="number"
            saveToDb={saveToDb}
            error={errors.anzahl}
          />
          <RadioButtonGroup
            key={`${row.id}methode`}
            name="methode"
            label="Methode"
            value={row.methode}
            dataSource={methodeWerte}
            saveToDb={saveToDb}
            error={errors.methode}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Tpopkontrzaehl)
