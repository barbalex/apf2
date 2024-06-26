import React, { useCallback, useContext, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import RadioButtonGroup from '../../../shared/RadioButtonGroup.jsx'
import TextField from '../../../shared/TextField.jsx'
import FormTitle from '../../../shared/FormTitle/index.jsx'
import storeContext from '../../../../storeContext.js'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import Spinner from '../../../shared/Spinner.jsx'
import Error from '../../../shared/Error.jsx'
import { tpopber } from '../../../shared/fragments.js'

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
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Tpopber = () => {
  const { tpopberId: id } = useParams()

  const client = useApolloClient()
  const queryClient = useQueryClient()
  const store = useContext(storeContext)

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
        id,
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
        <FormTitle title="Kontroll-Bericht Teil-Population" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
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
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Tpopber)
