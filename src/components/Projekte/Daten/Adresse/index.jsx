import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { gql } from '@apollo/client';
import { useApolloClient, useQuery } from "@apollo/client/react";
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { TextField } from '../../../shared/TextField.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { adresse } from '../../../shared/fragments.js'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FormContainer = styled.div`
  padding: 10px;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
`

const fieldTypes = {
  name: 'String',
  adresse: 'String',
  telefon: 'String',
  email: 'String',
  freiwErfko: 'Boolean',
}

export const Component = memo(
  observer(() => {
    const { adrId } = useParams()
    const store = useContext(MobxContext)
    const queryClient = useQueryClient()

    const { data, error, loading } = useQuery(query, {
      variables: { id: adrId },
    })
    const client = useApolloClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const row = useMemo(() => data?.adresseById ?? {}, [data?.adresseById])

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
            mutation updateAdresse(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateAdresseById(
                input: {
                  id: $id
                  adressePatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                adresse {
                  ...AdresseFields
                }
              }
            }
            ${adresse}
          `,
            variables,
          })
        } catch (error) {
          return setFieldErrors({ [field]: error.message })
        }
        setFieldErrors({})
        if (field === 'name') {
          queryClient.invalidateQueries({
            queryKey: [`treeAdresse`],
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
          <FormTitle title="Adresse" MenuBarComponent={Menu} />
          <FieldsContainer>
            <FormContainer>
              <TextField
                name="name"
                label="Name"
                type="text"
                value={row.name}
                saveToDb={saveToDb}
                error={fieldErrors.name}
              />
              <TextField
                name="adresse"
                label="Adresse"
                type="text"
                value={row.adresse}
                saveToDb={saveToDb}
                error={fieldErrors.adresse}
              />
              <TextField
                name="telefon"
                label="Telefon"
                type="text"
                value={row.telefon}
                saveToDb={saveToDb}
                error={fieldErrors.telefon}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                value={row.email}
                saveToDb={saveToDb}
                error={fieldErrors.email}
              />
              <Checkbox2States
                name="freiwErfko"
                label="freiwillige ErfolgskontrolleurIn"
                value={row.freiwErfko}
                saveToDb={saveToDb}
                error={fieldErrors.freiwErfko}
              />
            </FormContainer>
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
