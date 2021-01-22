import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { useApolloClient, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { adresse } from '../../../shared/fragments'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
`

const fieldTypes = {
  name: 'String',
  adresse: 'String',
  telefon: 'String',
  email: 'String',
  freiwErfko: 'Boolean',
  evabVorname: 'String',
  evabNachname: 'String',
  evabOrt: 'String',
}

const Adresse = ({ treeName }) => {
  const store = useContext(storeContext)
  const { appBarHeight } = store
  const { activeNodeArray } = store[treeName]
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
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateAdresse(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateAdresseById(
                input: {
                  id: $id
                  adressePatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                adresse {
                  ...AdresseFields
                }
              }
            }
            ${adresse}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateAdresseById: {
              adresse: {
                ...variables,
                __typename: 'Adresse',
              },
              __typename: 'Adresse',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row, store.user.name],
  )

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          apId={row.id}
          title="Adresse"
          treeName={treeName}
          table="adresse"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextField
                    name="name"
                    label="Name"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="adresse"
                    label="Adresse"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="telefon"
                    label="Telefon"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    handleSubmit={handleSubmit}
                  />
                  <Checkbox2States
                    name="freiwErfko"
                    label="freiwillige ErfolgskontrolleurIn"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="evabVorname"
                    label="EvAB Vorname"
                    type="text"
                    helperText="Wird für den Export in EvAB benötigt"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="evabNachname"
                    label="EvAB Nachname"
                    type="text"
                    helperText="Wird für den Export in EvAB benötigt"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="evabOrt"
                    label="EvAB Ort"
                    type="text"
                    helperText="Wird für den Export in EvAB benötigt. Muss immer einen Wert enthalten. Ist keine Ort bekannt, bitte - eintragen"
                    handleSubmit={handleSubmit}
                  />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Adresse)
