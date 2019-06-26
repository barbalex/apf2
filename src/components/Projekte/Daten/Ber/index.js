import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldWithUrl from '../../../shared/TextFieldWithUrl'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import updateBerByIdGql from './updateBerById'
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

const Ber = ({ treeName }) => {
  const store = useContext(storeContext)
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

  const row = get(data, 'berById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updateBerByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateBerById: {
              ber: {
                ...values,
                __typename: 'Ber',
              },
              __typename: 'Ber',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
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
          title="Bericht"
          treeName={treeName}
          table="ber"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  key={`${row.id}autor`}
                  name="autor"
                  label="AutorIn"
                  type="text"
                  component={TextField}
                />
                <Field
                  name="jahr"
                  label="Jahr"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="titel"
                  label="Titel"
                  type="text"
                  multiLine
                  component={TextField}
                />
                <Field
                  name="url"
                  label="URL"
                  type="text"
                  multiLine
                  component={TextFieldWithUrl}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Ber)
