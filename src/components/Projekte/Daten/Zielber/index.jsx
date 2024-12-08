import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../storeContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { zielber as zielberFragment } from '../../../shared/fragments.js'
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

const fieldTypes = {
  zielId: 'UUID',
  jahr: 'Int',
  erreichung: 'String',
  bemerkungen: 'String',
}

export const Component = memo(
  observer(() => {
    const { zielberId: id } = useParams()

    const client = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(MobxContext)

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(query, {
      variables: {
        id,
      },
    })

    const row = useMemo(() => data?.zielberById ?? {}, [data?.zielberById])

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
            mutation updateZielber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateZielberById(
                input: {
                  id: $id
                  zielberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                zielber {
                  ...ZielberFields
                }
              }
            }
            ${zielberFragment}
          `,
            variables,
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        setFieldErrors({})
        if (['jahr', 'erreichung'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treeZielbers`],
          })
        }
      },
      [client, queryClient, row.id, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Ziel-Bericht"
            menuBar={<Menu />}
          />
          <FormContainer>
            <TextField
              name="jahr"
              label="Jahr"
              type="number"
              value={row.jahr}
              saveToDb={saveToDb}
              error={fieldErrors.jahr}
            />
            <TextField
              name="erreichung"
              label="Ziel-Erreichung"
              type="text"
              value={row.erreichung}
              saveToDb={saveToDb}
              error={fieldErrors.erreichung}
            />
            <TextField
              name="bemerkungen"
              label="Bemerkungen"
              type="text"
              multiLine
              value={row.bemerkungen}
              saveToDb={saveToDb}
              error={fieldErrors.bemerkungen}
            />
          </FormContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
