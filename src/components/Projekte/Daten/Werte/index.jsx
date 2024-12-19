import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams, useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
`

export const Component = memo(
  observer(() => {
    const { wertId: id } = useParams()
    const location = useLocation()
    const { pathname } = location
    const table =
      pathname.includes('ApberrelevantGrundWerte') ?
        'tpopApberrelevantGrundWerte'
      : pathname.includes('EkAbrechnungstypWerte') ? 'ekAbrechnungstypWerte'
      : pathname.includes('TpopkontrzaehlEinheitWerte') ?
        'tpopkontrzaehlEinheitWerte'
      : 'uups'

    const client = useApolloClient()
    const queryClient = useQueryClient()
    const store = useContext(MobxContext)

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
      [
        client,
        codeGqlType,
        queryClient,
        refetch,
        row.id,
        store.user.name,
        table,
      ],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title={table}
            MenuBarComponent={Menu}
            menuBarProps={{ row, table }}
          />
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
        </Container>
      </ErrorBoundary>
    )
  }),
)
