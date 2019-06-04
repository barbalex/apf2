import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import TextField from '../../../shared/TextField2'
import FormTitle from '../../../shared/FormTitle'
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
  const [errors, setErrors] = useState({})
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

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const typename = upperFirst(tableCamelCased)
      const value = ifIsNumericAsNumber(event.target.value)
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
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
      }
      refetch()
      const refetchTableName = `${table}s`
      refetchTree[refetchTableName] && refetchTree[refetchTableName]()
      setErrors({})
    },
    [row],
  )

  //console.log('Werte')

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
          <TextField
            key={`${row.id}text`}
            name="text"
            label="Text"
            row={row}
            type="text"
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}code`}
            name="code"
            label="Code"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
          <TextField
            key={`${row.id}sort`}
            name="sort"
            label="Sort"
            row={row}
            type="number"
            saveToDb={saveToDb}
            errors={errors}
          />
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Werte)
