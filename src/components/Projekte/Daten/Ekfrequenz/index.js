import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { Formik, Form, Field, FieldArray } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import RadioButton from '../../../shared/RadioButtonFormik'
import KontrolljahrField from './KontrolljahrField'
import FormTitle from '../../../shared/FormTitle'
import Label from '../../../shared/Label'
import query from './query'
import updateEkfrequenzByIdGql from './updateEkfrequenzById'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const Ekfrequenz = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'ekfrequenzById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updateEkfrequenzByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkfrequenzById: {
              ekfrequenz: {
                ...values,
                __typename: 'Ekfrequenz',
              },
              __typename: 'Ekfrequenz',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
      if (changedField === 'zaehleinheitId') refetch.ekfrequenzs()
    },
    [row],
  )

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
          apId={row.apId}
          title="EK-Frequenz"
          treeName={treeName}
          table="ekfrequenz"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty, values }) => (
              <Form
                onBlur={event => {
                  // prevent submitting when button blurs
                  if (event.target.type === 'button') return
                  dirty && handleSubmit()
                }}
              >
                <Field name="ek" label="EK" component={RadioButton} />
                <Field name="ekf" label="EKF" component={RadioButton} />
                <Field
                  name="anwendungsfall"
                  label="Anwendungsfall"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="code"
                  label="Kürzel"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="name"
                  label="Name"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="periodizitaet"
                  label="Periodizität"
                  type="text"
                  component={TextField}
                />
                <FieldArray
                  name="kontrolljahre"
                  render={arrayHelpers => (
                    <div>
                      <Label label="Kontrolljahre" />
                      {values.kontrolljahre &&
                      values.kontrolljahre.length > 0 ? (
                        <>
                          {values.kontrolljahre
                            .sort((a, b) => {
                              if (a === '') return -1
                              if (b === '') return -1
                              return a - b
                            })
                            .map((kontrolljahr, index) => (
                              <div key={index}>
                                <Field
                                  name={`kontrolljahre.${index}`}
                                  component={KontrolljahrField}
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  -
                                </button>
                              </div>
                            ))}
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.insert(
                                values.kontrolljahre.length - 1,
                                '',
                              )
                            }
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.push(0)}
                        >
                          {/* show this when user has removed all kontrolljahre from the list */}
                          Neues Kontrolljahr
                        </button>
                      )}
                    </div>
                  )}
                />
                <Field
                  name="anzahl_min"
                  label="Anzahl von"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="anzahl_max"
                  label="Anzahl bis und mit"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="bemerkungen"
                  label="Bemerkungen"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="sort"
                  label="Sortierung"
                  type="number"
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

export default observer(Ekfrequenz)
