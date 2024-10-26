import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup.jsx'
import TextField from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import query from './query.js'
import queryLists from './queryLists'
import { StoreContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { erfkrit } from '../../../shared/fragments.js'
import { Spinner } from '../../../shared/Spinner.jsx'

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

const fieldTypes = {
  apId: 'UUID',
  erfolg: 'Int',
  kriterien: 'String',
}

const Erfkrit = () => {
  const { erfkritId: id } = useParams()

  const queryClient = useQueryClient()
  const client = useApolloClient()
  const store = useContext(StoreContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id,
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = useMemo(() => data?.erfkritById ?? {}, [data?.erfkritById])

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateErfkrit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateErfkritById(
                input: {
                  id: $id
                  erfkritPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                erfkrit {
                  ...ErfkritFields
                }
              }
            }
            ${erfkrit}
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      queryClient.invalidateQueries({
        queryKey: [`treeErfkrit`],
      })
    },
    [client, queryClient, row.id, store.user.name],
  )

  if (loading) return <Spinner />

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Erfolgs-Kriterium" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
            tabIndex={-1}
          >
            <FormContainer>
              <RadioButtonGroup
                name="erfolg"
                label="Beurteilung"
                dataSource={dataLists?.allApErfkritWertes?.nodes ?? []}
                loading={loadingLists}
                value={row.erfolg}
                saveToDb={saveToDb}
                error={fieldErrors.erfolg}
              />
              <TextField
                name="kriterien"
                label="Kriterien"
                type="text"
                multiLine
                value={row.kriterien}
                saveToDb={saveToDb}
                error={fieldErrors.kriterien}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Erfkrit)
