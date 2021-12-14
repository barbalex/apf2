import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextFieldFormik from '../../../shared/TextFieldFormik'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const LoadingContainer = styled.div`
  height: 100%;
  padding: 10px;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const StyledForm = styled(Form)`
  padding: 10px;
`
const FormContainer = styled.div`
  padding: 10px;
`

const Werte = ({ treeName, table }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch: refetchTree } = store
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

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

  const row = useMemo(
    () => data?.[`${tableCamelCased}ById`] ?? {},
    [data, tableCamelCased],
  )

  let codeGqlType = 'Int'
  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(tableCamelCased)) {
    codeGqlType = 'String'
    codeFieldType = 'text'
  }

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }

      const __typename = upperFirst(tableCamelCased)
      try {
        const mutation = gql`
          mutation updateWert(
            $id: UUID!
            $code: ${codeGqlType}
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            update${__typename}ById(
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
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      refetch()
      const refetchTableName = `${table}s`
      // for unknown reason refetching is necessary here
      refetchTree[refetchTableName] && refetchTree[refetchTableName]()
      setFieldErrors({})
    },
    [
      client,
      codeGqlType,
      refetch,
      refetchTree,
      row,
      store.user.name,
      table,
      tableCamelCased,
    ],
  )

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const __typename = upperFirst(tableCamelCased)
      try {
        const mutation = gql`
          mutation updateWert(
            $id: UUID!
            $code: ${codeGqlType}
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            update${__typename}ById(
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
        const variables = {
          ...objectsEmptyValuesToNull(values),
          changedBy: store.user.name,
        }
        const updateName = `update${__typename}`
        //console.log('Werte:', { variables, __typename, updateName })
        await client.mutate({
          mutation,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            [updateName]: {
              id: row.id,
              __typename,
              content: variables,
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      refetch()
      const refetchTableName = `${table}s`
      // for unknown reason refetching is necessary here
      refetchTree[refetchTableName] && refetchTree[refetchTableName]()
      setErrors({})
    },
    [
      client,
      codeGqlType,
      refetch,
      refetchTree,
      row,
      store.user.name,
      table,
      tableCamelCased,
    ],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

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
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik
              row={row}
              initialValues={row}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
                  <TextFieldFormik
                    name="text"
                    label="Text"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldFormik
                    name="code"
                    label="Code"
                    type={codeFieldType}
                    handleSubmit={handleSubmit}
                  />
                  <TextFieldFormik
                    name="sort"
                    label="Sort"
                    type="number"
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

export default observer(Werte)
