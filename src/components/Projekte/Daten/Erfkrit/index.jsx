import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client';
import { useApolloClient, useQuery } from "@apollo/client/react";
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { queryLists } from './queryLists.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { erfkrit } from '../../../shared/fragments.js'
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
  apId: 'UUID',
  erfolg: 'Int',
  kriterien: 'String',
}

export const Component = memo(
  observer(() => {
    const { erfkritId: id } = useParams()

    const queryClient = useQueryClient()
    const client = useApolloClient()
    const store = useContext(MobxContext)

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
          <FormTitle
            title="Erfolgs-Kriterium"
            MenuBarComponent={Menu}
          />
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
        </Container>
      </ErrorBoundary>
    )
  }),
)
