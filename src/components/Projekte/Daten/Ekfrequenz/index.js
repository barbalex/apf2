import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import RadioButton from '../../../shared/RadioButtonFormik'
import FormTitle from '../../../shared/FormTitle'
import Kontrolljahre from './Kontrolljahre'
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
      console.log('kontrolljahre:', values.kontrolljahre)
      try {
        await client.mutate({
          mutation: updateEkfrequenzByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            kontrolljahre: JSON.parse(`"[${values.kontrolljahre}]"`),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkfrequenzById: {
              ekfrequenz: {
                ...values,
                kontrolljahre: JSON.parse(`"[${values.kontrolljahre}]"`),
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
  console.log('Ekfrequenz rendering, kontrolljahre:', row.kontrolljahre)
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
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
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
                <Kontrolljahre kontrolljahre={row.kontrolljahre} />
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
