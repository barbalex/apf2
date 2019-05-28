import React, { useState, useCallback, useEffect, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import TextField from '../../../shared/TextField2'
import TextFieldWithUrl from '../../../shared/TextFieldWithUrl'
import FormTitle from '../../../shared/FormTitle'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import { tpopApberrelevantGrundWerte } from '../../../shared/fragments'

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
  const [errors, setErrors] = useState({})
  const { activeNodeArray } = store[treeName]

  const tableCamelCased = camelCase(table)

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'berById', {})

  useEffect(() => setErrors({}), [row])

  const saveToDb = useCallback(
    async event => {
      const field = event.target.name
      const typename = upperFirst(tableCamelCased)
      const value = ifIsNumericAsNumber(event.target.value)
      try {
        const fields = `${upperFirst(tableCamelCased)}Fields`
        const mutation = gql`
          mutation updateBer(
            $id: UUID!
            $code: Int
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            updateBerById(
              input: {
                id: $id
                berPatch: {
                  id: $id
                  code: $code
                  text: $text
                  sort: $sort
                  changedBy: $changedBy
                }
              }
            ) {
              ber {
                ...${fields}
              }
            }
          }
          ${tableCamelCased}
        `
        await client.mutate({
          mutation,
          variables: {
            id: row.id,
            [field]: value,
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateBerById: {
              ber: {
                id: row.id,
                sort: field === 'sort' ? value : row.sort,
                text: field === 'text' ? value : row.text,
                code: field === 'code' ? value : row.code,
                __typename: `'${typename}'`,
              },
              __typename: `'${typename}'`,
            },
          },
        })
      } catch (error) {
        return setErrors({ [field]: error.message })
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
