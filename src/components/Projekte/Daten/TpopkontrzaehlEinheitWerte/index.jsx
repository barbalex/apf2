// TODO: seems not to be in use?
import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { MobxContext } from '../../../../storeContext.js'
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

const query = gql`
  query werteByIdQueryForTpopkontrzaehlEinheitWerte($id: UUID!) {
    tpopkontrzaehlEinheitWerteById(id: $id) {
      id
      code
      text
      correspondsToMassnAnzPflanzen
      correspondsToMassnAnzTriebe
      sort
    }
  }
`

export const TpopkontrzaehlEinheitWerte = memo(
  observer(({ table }) => {
    const { zaehleinheitId: id } = useParams()

    const client = useApolloClient()
    const queryClient = useQueryClient()

    const store = useContext(MobxContext)
    const { refetch: refetchTree } = store

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error, refetch } = useQuery(query, {
      variables: {
        id,
      },
    })

    const row = useMemo(
      () => data?.tpopkontrzaehlEinheitWerteById ?? {},
      [data?.tpopkontrzaehlEinheitWerteById],
    )

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
          const mutation = gql`
            mutation updateWert(
              $id: UUID!
              $code: Int
              $text: String
              $correspondsToMassnAnzPflanzen: Boolean
              $correspondsToMassnAnzTriebe: Boolean
              $sort: Int
              $changedBy: String
            ) {
              updateTpopkontrzaehlEinheitWerteById(
                input: {
                  id: $id
                  tpopkontrzaehlEinheitWertePatch: {
                    id: $id
                    code: $code
                    text: $text
                    correspondsToMassnAnzPflanzen: $correspondsToMassnAnzPflanzen
                    correspondsToMassnAnzTriebe: $correspondsToMassnAnzTriebe
                    sort: $sort
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehlEinheitWerte {
                  id
                  code
                  text
                  correspondsToMassnAnzPflanzen
                  correspondsToMassnAnzTriebe
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
        const refetchTableName = `${table}s`
        // for unknown reason refetching is necessary here
        refetchTree[refetchTableName] && refetchTree[refetchTableName]()
        setFieldErrors({})
        queryClient.invalidateQueries({
          queryKey: [`treeTpopkontrzaehlEinheitWertes`],
        })
      },
      [
        client,
        queryClient,
        refetch,
        refetchTree,
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
          <FormTitle title={table} />
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
              type="number"
              value={row.code}
              saveToDb={saveToDb}
              error={fieldErrors.code}
            />
            <Checkbox2States
              name="correspondsToMassnAnzPflanzen"
              label="Entspricht 'Anzahl Pflanzen' in Massnahmen"
              value={row.correspondsToMassnAnzPflanzen}
              saveToDb={saveToDb}
              error={fieldErrors.correspondsToMassnAnzPflanzen}
            />
            <Checkbox2States
              name="correspondsToMassnAnzTriebe"
              label="Entspricht 'Anzahl Triebe' in Massnahmen"
              value={row.correspondsToMassnAnzTriebe}
              saveToDb={saveToDb}
              error={fieldErrors.correspondsToMassnAnzTriebe}
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
