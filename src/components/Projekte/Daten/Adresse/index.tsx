import { useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.ts'
import { MobxContext } from '../../../../mobxContext.js'
import { Menu } from './Menu.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { adresse } from '../../../shared/fragments.ts'

import type Adresse from '../../../../models/apflora/Adresse.js'

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

export const Component = observer(() => {
  const { adrId } = useParams<{ adrId: string }>()
  const store = useContext(MobxContext)
  const tsQueryClient = useQueryClient()

  const { data, error, loading } = useQuery<AdresseQueryResult>(query, {
    variables: { id: adrId },
  })
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const row: Adresse = data?.adresseById ?? {}

  const saveToDb = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: store.user.name,
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
      return setFieldErrors({ [field]: (error as Error).message })
    }
    setFieldErrors({})
    if (field === 'name') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAdresse`],
      })
    }
  }

  if (loading) return <Spinner />
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Adresse"
          MenuBarComponent={Menu}
        />
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
      </div>
    </ErrorBoundary>
  )
})
