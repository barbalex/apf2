import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type { ProjektId } from '../../../../models/apflora/index.tsx'

import styles from './Projekt.module.css'

interface ProjektQueryResult {
  projektById?: {
    id: ProjektId
    name: string | null
    changedBy: string | null
  }
}

const fieldTypes = { name: 'String' }

export const Component = () => {
  const { projId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['projekt', projId],
    queryFn: async () => {
      const result = await apolloClient.query<ProjektQueryResult>({
        query,
        variables: { id: projId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.projektById ?? {}

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
            mutation updateProjekt(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateProjektById(
                input: {
                  id: $id
                  projektPatch: { 
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                projekt {
                  id
                  name
                  changedBy
                }
              }
            }
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
    // Invalidate queries to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['projekt', projId],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle title="Projekt" />
        <div className={styles.formContainer}>
          <TextField
            name="name"
            label="Name"
            type="text"
            value={row.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
