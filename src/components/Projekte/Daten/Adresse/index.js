import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { observer } from 'mobx-react-lite'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import RadioButton from '../../../shared/RadioButtonFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import updateAdresseByIdGql from './updateAdresseById'
import query from './query'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: calc(100vh - 64px);
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

  const row = get(data, 'adresseById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updateAdresseByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateAdresseById: {
              adresse: {
                ...values,
                __typename: 'Adresse',
              },
              __typename: 'Adresse',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      ;[('name', 'role')].includes(changedField) && refetch.adresses()
      setErrors({})
    },
    [row],
  )

  //console.log('Adresse')

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
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="name"
                  label="Name"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="adresse"
                  label="Adresse"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="telefon"
                  label="Telefon"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="email"
                  label="Email"
                  type="email"
                  component={TextField}
                />
                <Field
                  name="freiwErfko"
                  label="freiwillige ErfolgskontrolleurIn"
                  component={RadioButton}
                />
                <Field
                  name="evabVorname"
                  label="EvAB Vorname"
                  type="text"
                  helperText="Wird für den Export in EvAB benötigt"
                  component={TextField}
                />
                <Field
                  name="evabNachname"
                  label="EvAB Nachname"
                  type="text"
                  helperText="Wird für den Export in EvAB benötigt"
                  component={TextField}
                />
                <Field
                  name="evabOrt"
                  label="EvAB Ort"
                  type="text"
                  helperText="Wird für den Export in EvAB benötigt. Muss immer einen Wert enthalten. Ist keine Ort bekannt, bitte - eintragen"
                  component={TextField}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Adresse)
