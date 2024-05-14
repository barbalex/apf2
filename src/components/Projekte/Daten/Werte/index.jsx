import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`
const FormContainer = styled.div`
  padding: 10px;
`

const Werte = () => {
  const { wertId: id } = useParams()
  const location = useLocation()
  const { pathname } = location
  const table = pathname.includes('ApberrelevantGrundWerte')
    ? 'tpopApberrelevantGrundWerte'
    : pathname.includes('EkAbrechnungstypWerte')
      ? 'ekAbrechnungstypWerte'
      : pathname.includes('TpopkontrzaehlEinheitWerte')
        ? 'tpopkontrzaehlEinheitWerte'
        : 'uups'

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(storeContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const query = gql`
    query werteByIdQuery($id: UUID!) {
      ${table}ById(id: $id) {
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

  const row = useMemo(() => data?.[`${table}ById`] ?? {}, [data, table])

  let codeGqlType = 'Int'
  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(table)) {
    codeGqlType = 'String'
    codeFieldType = 'text'
  }

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }

      const typename = upperFirst(table)
      try {
        const mutation = gql`
          mutation updateWert(
            $id: UUID!
            $code: ${codeGqlType}
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            update${typename}ById(
              input: {
                id: $id
                ${table}Patch: {
                  id: $id
                  code: $code
                  text: $text
                  sort: $sort
                  changedBy: $changedBy
                }
              }
            ) {
              ${table} {
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
      setFieldErrors({})
      if (['text', 'sort'].includes(field)) {
        queryClient.invalidateQueries({
          queryKey: [`tree${upperFirst(table)}`],
        })
      }
    },
    [client, codeGqlType, queryClient, refetch, row.id, store.user.name, table],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title={table} />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <TextField
                name="text"
                label="Text"
                type="text"
                value={row.text}
                saveToDb={saveToDb}
                error={fieldErrors.text}
              />
              <TextField
                name="code"
                label="Code"
                type={codeFieldType}
                value={row.code}
                saveToDb={saveToDb}
                error={fieldErrors.code}
              />
              <TextField
                name="sort"
                label="Sort"
                type="number"
                value={row.sort}
                saveToDb={saveToDb}
                error={fieldErrors.sort}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Werte)
