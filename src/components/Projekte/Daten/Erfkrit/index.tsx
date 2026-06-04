import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { erfkrit } from '../../../shared/fragments.ts'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type {
  Erfkrit,
  ApErfkritWerteCode,
} from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface ErfkritQueryResult {
  erfkritById?: Erfkrit
  allApErfkritWertes?: {
    nodes: Array<{
      value: ApErfkritWerteCode
      label: string | null
    }>
  }
}

const fieldTypes = {
  apId: 'UUID',
  erfolg: 'Int',
  kriterien: 'String',
}

export const Component = () => {
  const { erfkritId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['erfkrit', id],
    queryFn: async () => {
      const result = await apolloClient.query<ErfkritQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.erfkritById ?? {}

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
            mutation updateErfkrit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateErfkritById(
                input: {
                  id: $id
                  erfkritPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                erfkrit {
                  ...ErfkritFields
                }
              }
            }
            ${erfkrit}
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
      queryKey: ['erfkrit', id],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeErfkrit`],
    })
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Erfolgs-Kriterium"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <RadioButtonGroup
            name="erfolg"
            label="Beurteilung"
            dataSource={data?.allApErfkritWertes?.nodes ?? []}
            value={row.erfolg}
            saveToDb={saveToDb}
            error={fieldErrors.erfolg}
          />
          <TextField
            name="kriterien"
            label="Kriterien"
            type="text"
            multiLine
            value={row.kriterien}
            saveToDb={saveToDb}
            error={fieldErrors.kriterien}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
