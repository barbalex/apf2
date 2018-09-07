// @flow
import React from 'react'
import styled from 'styled-components'
import { Query, Mutation } from 'react-apollo'
import get from 'lodash/get'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import RadioButton from '../../../shared/RadioButton'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import updateAdresseByIdGql from './updateAdresseById.graphql'

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
  withState('errors', 'setErrors', {}),
  withHandlers({
    saveToDb: ({ refetchTree, setErrors, errors }) => async ({
      row,
      field,
      value,
      updateAdresse,
    }) => {
      /**
       * only save if value changed
       */
      if (row[field] === value) return
      try {
        await updateAdresse({
          variables: {
            id: row.id,
            [field]: value,
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
      if (['name', 'role'].includes(field)) refetchTree()
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
}: {
  treeName: String,
  saveToDb: () => void,
  errors: Object,
}) => (
  <Query query={data1Gql}>
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`
      const id = get(data, `${treeName}.activeNodeArray[2]`)

      return (
        <Query query={data2Gql} variables={{ id }}>
          {({ loading, error, data, client }) => {
            if (loading)
              return (
                <Container>
                  <FieldsContainer>Lade...</FieldsContainer>
                </Container>
              )
            if (error) return `Fehler: ${error.message}`

            const row = get(data, 'adresseById')
            const activeNodeArray = get(data, `${treeName}.activeNodeArray`)

            return (
              <ErrorBoundary>
                <Container>
                  <FormTitle
                    apId={id}
                    title="Adresse"
                    activeNodeArray={activeNodeArray}
                    treeName={treeName}
                    table="adresse"
                  />
                  <Mutation mutation={updateAdresseByIdGql}>
                    {(updateAdresse, { data }) => (
                      <FieldsContainer>
                        <TextField
                          key={`${row.id}name`}
                          label="Name"
                          value={row.name}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'name',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.name}
                        />
                        <TextField
                          key={`${row.id}adresse`}
                          label="Adresse"
                          value={row.adresse}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'adresse',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.adresse}
                        />
                        <TextField
                          key={`${row.id}telefon`}
                          label="Telefon"
                          value={row.telefon}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'telefon',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.telefon}
                        />
                        <TextField
                          key={`${row.id}email`}
                          label="Email"
                          value={row.email}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'email',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.email}
                        />
                        <RadioButton
                          key={`${row.id}freiwErfko`}
                          label="freiwillige ErfolgskontrolleurIn"
                          value={row.freiwErfko}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'freiwErfko',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.freiwErfko}
                        />
                        <TextField
                          key={`${row.id}evabVorname`}
                          label="EvAB Vorname"
                          value={row.evabVorname}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'evabVorname',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.evabVorname}
                          helperText="Wird für den Export in EvAB benötigt"
                        />
                        <TextField
                          key={`${row.id}evabNachname`}
                          label="EvAB Nachname"
                          value={row.evabNachname}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'evabNachname',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.evabNachname}
                          helperText="Wird für den Export in EvAB benötigt"
                        />
                        <TextField
                          key={`${row.id}evabOrt`}
                          label="EvAB Ort"
                          value={row.evabOrt}
                          saveToDb={value =>
                            saveToDb({
                              row,
                              field: 'evabOrt',
                              value,
                              updateAdresse,
                            })
                          }
                          error={errors.evabOrt}
                          helperText="Wird für den Export in EvAB benötigt. Muss immer einen Wert enthalten. Ist keine Ort bekannt, bitte - eintragen"
                        />
                      </FieldsContainer>
                    )}
                  </Mutation>
                </Container>
              </ErrorBoundary>
            )
          }}
        </Query>
      )
    }}
  </Query>
)

export default enhance(Adresse)
