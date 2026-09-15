import { useState } from 'react'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { erfkrit } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type { Erfkrit } from '../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface ErfkritQueryResult {
  erfkritById?: Erfkrit
  allApErfkritWertes?: {
    nodes: {
      value: number
      label: string | null
    }[]
  }
}

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource: { value: number; label: string | null }[]
  value?: number | null | undefined
  saveToDb: (
    event: { target: { name?: string; value: string | number | null } },
  ) => void
  error?: string | undefined
}>

const fieldTypes: Record<string, string> = {
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

  const { data } = useSuspenseQuery({
    queryKey: ['erfkrit', id],
    queryFn: async () => {
      const result = await apolloClient.query<ErfkritQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row: Partial<Erfkrit> = data?.erfkritById ?? {}

  const saveToDb = async (event: {
    target: { name?: string; value: unknown }
  }) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate({
        mutation: dynamicGql`
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
    void tsQueryClient.invalidateQueries({
      queryKey: ['erfkrit', id],
    })
    void tsQueryClient.invalidateQueries({
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
          <TypedRadioButtonGroup
            name="erfolg"
            label="Beurteilung"
            dataSource={data?.allApErfkritWertes?.nodes ?? []}
            value={row.erfolg}
            saveToDb={(event) => void saveToDb(event)}
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
