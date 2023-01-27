import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import { erfkrit } from '../../../shared/fragments'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
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

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(storeContext)

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
      queryClient.invalidateQueries({ queryKey: [`treeQuery`] })
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

export default observer(Erfkrit)
