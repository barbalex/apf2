// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'

import RadioButton from '../../../shared/RadioButton'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateAdresseByIdGql from './updateAdresseById'
import withLocalData from './withLocalData'
import withData from './withData'

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
  withLocalData,
  withData,
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors, data }) => async event => {
      const field = event.target.name
      const value = event.target.value || null
      const row = get(data, 'adresseById', {})
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        app.client.mutate({
          mutation: updateAdresseByIdGql,
          variables: {
            id: row.id,
            [field]: value,
          },
          /*optimisticResponse: {
            __typename: 'Mutation',
            updateAdresseById: {
              adresse: {
                id: row.id,
                name: field === 'name' ? value : row.name,
                email: field === 'email' ? value : row.email,
                adresse: field === 'adresse' ? value : row.adresse,
                telefon: field === 'telefon' ? value : row.telefon,
                freiwErfko: field === 'freiwErfko' ? value : row.freiwErfko,
                evabVorname: field === 'evabVorname' ? value : row.evabVorname,
                evabNachname:
                  field === 'evabNachname' ? value : row.evabNachname,
                evabOrt: field === 'evabOrt' ? value : row.evabOrt,
                __typename: 'Adresse',
              },
              __typename: 'Adresse',
            },
          },*/
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['name', 'role'].includes(field)) refetchTree('adresses')
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

const Adresse = ({
  treeName,
  saveToDb,
  errors,
  localData,
  data,
}: {
  treeName: String,
  saveToDb: () => void,
  errors: Object,
  localData: Object,
  data: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  const id = get(localData, `${treeName}.activeNodeArray[2]`)

  if (data.loading)
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  if (data.error) return `Fehler: ${data.error.message}`

  const row = get(data, 'adresseById', {})

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={id}
          title="Adresse"
          treeName={treeName}
          table="adresse"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}name`}
            name="name"
            label="Name"
            value={row.name}
            saveToDb={saveToDb}
            error={errors.name}
          />
          <TextField
            key={`${row.id}adresse`}
            name="adresse"
            label="Adresse"
            value={row.adresse}
            saveToDb={saveToDb}
            error={errors.adresse}
          />
          <TextField
            key={`${row.id}telefon`}
            name="telefon"
            label="Telefon"
            value={row.telefon}
            saveToDb={saveToDb}
            error={errors.telefon}
          />
          <TextField
            key={`${row.id}email`}
            name="email"
            label="Email"
            value={row.email}
            saveToDb={saveToDb}
            error={errors.email}
          />
          <RadioButton
            key={`${row.id}freiwErfko`}
            name="freiwErfko"
            label="freiwillige ErfolgskontrolleurIn"
            value={row.freiwErfko}
            saveToDb={saveToDb}
            error={errors.freiwErfko}
          />
          <TextField
            key={`${row.id}evabVorname`}
            name="evabVorname"
            label="EvAB Vorname"
            value={row.evabVorname}
            saveToDb={saveToDb}
            error={errors.evabVorname}
            helperText="Wird für den Export in EvAB benötigt"
          />
          <TextField
            key={`${row.id}evabNachname`}
            name="evabNachname"
            label="EvAB Nachname"
            value={row.evabNachname}
            saveToDb={saveToDb}
            error={errors.evabNachname}
            helperText="Wird für den Export in EvAB benötigt"
          />
          <TextField
            key={`${row.id}evabOrt`}
            name="evabOrt"
            label="EvAB Ort"
            value={row.evabOrt}
            saveToDb={saveToDb}
            error={errors.evabOrt}
            helperText="Wird für den Export in EvAB benötigt. Muss immer einen Wert enthalten. Ist keine Ort bekannt, bitte - eintragen"
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Adresse)
