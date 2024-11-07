import { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { StoreContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

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

const fieldTypes = {
  name: 'String',
}

export const Component = observer(() => {
  const { projId } = useParams()

  const queryClient = useQueryClient()
  const client = useApolloClient()
  const store = useContext(StoreContext)

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error } = useQuery(query, {
    variables: {
      id: projId,
    },
  })

  const row = useMemo(() => data?.projektById ?? {}, [data?.projektById])

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
            mutation updateProjekt(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateProjektById(
                input: {
                  id: $id
                  projektPatch: { 
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                projekt {
                  id
                  name
                  changedBy
                }
              }
            }
          `,
          variables,
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      queryClient.invalidateQueries({
        queryKey: [`treeRoot`],
      })
    },
    [client, queryClient, row.id, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Projekt" />
        <FormContainer>
          <TextField
            name="name"
            label="Name"
            type="text"
            value={row.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
        </FormContainer>
      </Container>
    </ErrorBoundary>
  )
})
