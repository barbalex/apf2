import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import FormTitle from '../../../shared/FormTitle'
import TextField from '../../../shared/TextFieldFormik'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
`

const Werte = ({ treeName, table }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { refetch: refetchTree } = store
  const { activeNodeArray } = store[treeName]

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

  let codeGqlType = 'Int'
  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(tableCamelCased)) {
    codeGqlType = 'String'
    codeFieldType = 'text'
  }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title={table}
          treeName={treeName}
          table={table}
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
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
                  <TextField
                    name="text"
                    label="Text"
                    type="text"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="code"
                    label="Code"
                    type={codeFieldType}
                    handleSubmit={handleSubmit}
                  />
                  <TextField
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
