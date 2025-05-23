import { memo, useCallback, useContext, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { tpopber } from '../../../shared/fragments.js'
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
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

export const Component = memo(
  observer(() => {
    const { tpopberId } = useParams()

    const client = useApolloClient()
    const queryClient = useQueryClient()
    const store = useContext(MobxContext)

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error } = useQuery(
      gql`
        query tpopberByIdQuery($id: UUID!) {
          tpopberById(id: $id) {
            ...TpopberFields
          }
          allTpopEntwicklungWertes(orderBy: SORT_ASC) {
            nodes {
              value: code
              label: text
            }
          }
        }
        ${tpopber}
      `,
      {
        variables: {
          id: tpopberId,
        },
      },
    )

    const row = useMemo(() => data?.tpopberById ?? {}, [data?.tpopberById])

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
          mutation updateTpopber(
            $id: UUID!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updateTpopberById(
              input: {
                id: $id
                tpopberPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              tpopber {
                ...TpopberFields
              }
            }
          }
          ${tpopber}
        `,
            variables,
            refetchQueries: ['tpopberByIdQuery'],
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        // only set if necessary (to reduce renders)
        if (Object.keys(fieldErrors).length) {
          setFieldErrors({})
        }
        if (['jahr', 'entwicklung'].includes(field)) {
          queryClient.invalidateQueries({
            queryKey: [`treeTpopber`],
          })
        }
      },
      [client, fieldErrors, queryClient, row, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Kontroll-Bericht Teil-Population"
            MenuBarComponent={Menu}
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
            <RadioButtonGroup
              name="entwicklung"
              label="Entwicklung"
              dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
              loading={loading}
              value={row.entwicklung}
              saveToDb={saveToDb}
              error={fieldErrors.entwicklung}
            />
            <TextField
              name="bemerkungen"
              label="Bemerkungen"
              type="text"
              value={row.bemerkungen}
              multiLine
              saveToDb={saveToDb}
              error={fieldErrors.bemerkungen}
            />
          </FormContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
