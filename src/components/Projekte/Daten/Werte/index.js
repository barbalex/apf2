import React, { useCallback, useContext, useRef } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import { Formik, Form, Field } from 'formik'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextFieldFormik'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'

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

const Werte = ({ treeName, table }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { refetch: refetchTree } = store
  const { activeNodeArray } = store[treeName]

  const handleSubmitRef = useRef(null)
  const dirtyRef = useRef(null)

  const tableCamelCased = camelCase(table)
  const id =
    activeNodeArray.length > 2
      ? activeNodeArray[2]
      : '99999999-9999-9999-9999-999999999999'
  const query = gql`
    query werteByIdQuery($id: UUID!) {
      ${tableCamelCased}ById(id: $id) {
        id
        code
        text
        sort
      }
    }
  `
  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id,
    },
  })

  const row = get(data, `${tableCamelCased}ById`, {})

  //console.log('Werte rendering, row:', row)

  // save on change row
  // did not work when returning to same dataset
  /*useEffect(() => {
    return () => {
      const dirty = dirtyRef.current
      console.log('Werte changing row', { dirty })
      if (dirty) {
        console.log('Werte submitting on changing row')
        handleSubmitRef.current()
      }
    }
  }, [row])*/

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      //console.log('submitting')
      const typename = upperFirst(tableCamelCased)
      try {
        const mutation = gql`
          mutation updateWert(
            $id: UUID!
            $code: Int
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            update${typename}ById(
              input: {
                id: $id
                ${tableCamelCased}Patch: {
                  id: $id
                  code: $code
                  text: $text
                  sort: $sort
                  changedBy: $changedBy
                }
              }
            ) {
              ${tableCamelCased} {
                id
                code
                text
                sort
                changedBy
              }
            }
          }
        `
        await client.mutate({
          mutation,
          variables: {
            id: values.id,
            code: ifIsNumericAsNumber(values.code),
            text: values.text,
            sort: ifIsNumericAsNumber(values.sort),
            changedBy: store.user.name,
          },
        })
      } catch (error) {
        const { message } = error
        const field = message.includes('$code')
          ? 'code'
          : message.includes('$text')
          ? 'text'
          : 'sort'
        return setErrors({ [field]: message })
      }
      refetch()
      const refetchTableName = `${table}s`
      refetchTree[refetchTableName] && refetchTree[refetchTableName]()
      setErrors({})
    },
    [row.id, table],
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
          title={table}
          treeName={treeName}
          table={table}
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ isSubmitting, handleSubmit, dirty }) => {
              handleSubmitRef.current = handleSubmit
              dirtyRef.current = dirty

              return (
                <Form onBlur={() => dirty && handleSubmit()}>
                  <Field
                    component={TextField}
                    name="text"
                    label="Text"
                    type="text"
                  />
                  <Field
                    component={TextField}
                    name="code"
                    label="Code"
                    type="number"
                  />
                  <Field
                    component={TextField}
                    name="sort"
                    label="Sort"
                    type="number"
                  />
                </Form>
              )
            }}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Werte)
