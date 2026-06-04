import { useState, Suspense, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { Menu } from './Menu.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { adresse } from '../../../shared/fragments.ts'

import type Adresse from '../../../../models/apflora/Adresse.ts'

import styles from './index.module.css'

const fieldTypes = {
  name: 'String',
  adresse: 'String',
  telefon: 'String',
  email: 'String',
  freiwErfko: 'Boolean',
}

interface AdresseQueryResult {
  adresseById: Adresse
}

export const Component = () => {
  const { adrId } = useParams<{ adrId: string }>()
  const userName = useAtomValue(userNameAtom)
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ['Adresse', adrId],
    queryFn: async () => {
      const result = await apolloClient.query<AdresseQueryResult>({
        query,
        variables: { id: adrId },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const row: Adresse = data?.adresseById ?? {}

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate<any>({
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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (field === 'name') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAdresse`],
      })
    }
  }

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Adresse"
          MenuBarComponent={Menu}
        />
        <Suspense fallback={<Spinner />}>
          <div className={styles.fieldsContainer}>
            <div className={styles.formContainer}>
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
            </div>
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
