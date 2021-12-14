import React, { useCallback, useContext, useState, useMemo } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import RadioButtonGroup from '../../../shared/RadioButtonGroup'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Spinner from '../../../shared/Spinner'
import Error from '../../../shared/Error'
import { tpopber } from '../../../shared/fragments'

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
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Tpopber = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]

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
        id:
          activeNodeArray.length > 9
            ? activeNodeArray[9]
            : '99999999-9999-9999-9999-999999999999',
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
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopberById: {
              tpopber: {
                ...row,
                ...variables,
              },
              __typename: 'Tpopber',
            },
          },
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      // only set if necessary (to reduce renders)
      if (Object.keys(fieldErrors).length) {
        setFieldErrors({})
      }
    },
    [client, fieldErrors, row, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Kontroll-Bericht Teil-Population"
          treeName={treeName}
          table="tpopber"
        />
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

export default observer(Tpopber)
