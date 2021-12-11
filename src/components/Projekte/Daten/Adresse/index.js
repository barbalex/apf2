import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useApolloClient, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

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

const Adresse = ({ treeName }) => {
  const store = useContext(storeContext)
  const { activeNodeArray } = store[treeName]
  const id =
    activeNodeArray.length > 2
      ? activeNodeArray[2]
      : '99999999-9999-9999-9999-999999999999'
  const { data, error, loading } = useQuery(query, {
    variables: { id },
  })
  const client = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const row = useMemo(() => data?.adresseById ?? {}, [data?.adresseById])

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      let value = ifIsNumericAsNumber(event.target.value)

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
    },
    [client, row, store.user.name],
  )

  if (loading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.id}
          title="Adresse"
          treeName={treeName}
          table="adresse"
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
