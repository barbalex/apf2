import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useApolloClient, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import Checkbox2States from '../../../shared/Checkbox2States'
import TextField from '../../../shared/TextField'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import { adresse } from '../../../shared/fragments'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FormContainer = styled.div`
  padding: 10px;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`

const fieldTypes = {
  name: 'String',
  adresse: 'String',
  telefon: 'String',
  email: 'String',
  freiwErfko: 'Boolean',
}

const Adresse = () => {
  const { adrId } = useParams()
  const store = useContext(storeContext)
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
        store.tree.incrementRefetcher()
      }
    },
    [client, row.id, store.tree, store.user.name],
  )

  if (loading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Adresse" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
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
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Adresse)
