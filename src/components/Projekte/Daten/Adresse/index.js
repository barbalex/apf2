// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { observer } from 'mobx-react-lite'

import RadioButton from '../../../shared/RadioButton'
import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import updateAdresseByIdGql from './updateAdresseById'
import query from './query'
import storeContext from '../../../../storeContext'
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

const Adresse = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray, refetch } = store[treeName]
  const id =
    activeNodeArray.length > 2
      ? activeNodeArray[2]
      : '99999999-9999-9999-9999-999999999999'
  const { data, error, loading } = useQuery(query, {
    variables: { id },
  })
  const client = useApolloClient()
  const [errors, setErrors] = useState({})

  const row = get(data, 'adresseById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        await client.mutate({
          mutation: updateAdresseByIdGql,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
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
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      setErrors({})
      if (['name', 'role'].includes(field) && refetch && refetch.adresses) {
        refetch.adresses()
      }
    },
    [row],
  )

  console.log('Adresse')

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.id}
          title="Adresse"
          treeName={treeName}
          table="adresse"
        />
        <FieldsContainer>
          <TextField
            key={`${row.id}name`}
            name="name"
            label="Name"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}adresse`}
            name="adresse"
            label="Adresse"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}telefon`}
            name="telefon"
            label="Telefon"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}email`}
            name="email"
            label="Email"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
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
            row={row}
            saveToDb={saveToDb}
            errors={errors}
            helperText="Wird für den Export in EvAB benötigt"
          />
          <TextField
            key={`${row.id}evabNachname`}
            name="evabNachname"
            label="EvAB Nachname"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
            helperText="Wird für den Export in EvAB benötigt"
          />
          <TextField
            key={`${row.id}evabOrt`}
            name="evabOrt"
            label="EvAB Ort"
            row={row}
            saveToDb={saveToDb}
            errors={errors}
            helperText="Wird für den Export in EvAB benötigt. Muss immer einen Wert enthalten. Ist keine Ort bekannt, bitte - eintragen"
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Adresse)
