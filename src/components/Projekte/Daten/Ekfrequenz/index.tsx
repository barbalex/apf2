import { useState } from 'react'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { Kontrolljahre } from './Kontrolljahre.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryEkAbrechnungstypWertes } from './queryEkAbrechnungstypWertes.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ekfrequenz } from '../../../shared/fragments.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type {
  EkfrequenzId,
  ApId,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface EkfrequenzNode {
  id: EkfrequenzId
  apId: ApId
  ektyp: string | null
  anwendungsfall: string | null
  code: string | null
  kontrolljahre: number[] | null
  kontrolljahreAb: string | null
  bemerkungen: string | null
  sort: number | null
  ekAbrechnungstyp: string | null
  changedBy: string | null
  apByApId: {
    id: ApId
    ekfrequenzsByApId: {
      nodes: EkfrequenzNode[]
    }
  }
}

interface EkfrequenzQueryResult {
  ekfrequenzById: EkfrequenzNode | null
}

interface EkAbrechnungstypWertesQueryResult {
  allEkAbrechnungstypWertes: {
    nodes: {
      value: string
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
  dataSource: { value: string; label: string | null }[]
  loading?: boolean
  value?: string | null | undefined
  saveToDb: (
    event: { target: { name?: string; value: string | number | null } },
  ) => void
  error?: string | undefined
}>

const fieldTypes: Record<string, string> = {
  apId: 'UUID',
  ektyp: 'EkType',
  anwendungsfall: 'String',
  code: 'String',
  kontrolljahre: '[Int]',
  kontrolljahreAb: 'EkKontrolljahreAb',
  bemerkungen: 'String',
  sort: 'Int',
  ekAbrechnungstyp: 'String',
}

const ektypeWertes = [
  { value: 'EK', label: 'EK' },
  { value: 'EKF', label: 'EKF' },
]
const kontrolljahreAbWertes = [
  { value: 'EK', label: 'Kontrolle' },
  { value: 'ANSIEDLUNG', label: 'Ansiedlung' },
]

export const Component = () => {
  const { ekfrequenzId: id } = useParams()

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['ekfrequenz', id],
    queryFn: async () => {
      const result = await apolloClient.query<EkfrequenzQueryResult>({
        query,
        variables: {
          id,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const { data: dataEkAbrechnungstypWertes } = useSuspenseQuery({
    queryKey: ['ekAbrechnungstypWertes'],
    queryFn: async () => {
      const result =
        await apolloClient.query<EkAbrechnungstypWertesQueryResult>({
          query: queryEkAbrechnungstypWertes,
        })
      if (result.error) throw result.error
      return result.data
    },
    staleTime: Infinity, // This data rarely changes
  })

  const row: Partial<EkfrequenzNode> = data?.ekfrequenzById ?? {}
  const userName = useAtomValue(userNameAtom)

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
            mutation updateEkfrequenz(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkfrequenzById(
                input: {
                  id: $id
                  ekfrequenzPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekfrequenz {
                  ...EkfrequenzFields
                }
              }
            }
            ${ekfrequenz}
          `,
        variables,
      })
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
      return
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate query to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['ekfrequenz', id],
    })
    if (field === 'code') {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeEkfrequenz`],
      })
    }
    return
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="EK-Frequenz"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <TextField
            name="code"
            label="Kürzel"
            type="text"
            value={row.code}
            saveToDb={saveToDb}
            error={fieldErrors.code}
          />
          <TextField
            name="anwendungsfall"
            label="Anwendungsfall"
            type="text"
            value={row.anwendungsfall}
            saveToDb={saveToDb}
            error={fieldErrors.anwendungsfall}
          />
          <TypedRadioButtonGroup
            name="ektyp"
            dataSource={ektypeWertes}
            loading={false}
            label="EK-Typ"
            value={row.ektyp}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.ektyp}
          />
          <div className={styles.kontrolljahrContainer}>
            <div className={styles.labelRow}>
              <div className={styles.styledLabel}>
                Kontrolljahre (= Anzahl Jahre nach Start bzw. Ansiedlung)
              </div>
            </div>
            <Kontrolljahre
              kontrolljahre={row?.kontrolljahre?.slice()}
              saveToDb={saveToDb}
              refetch={() => void refetch()}
              //kontrolljahreString={JSON.stringify(row.kontrolljahre)}
            />
          </div>
          <TypedRadioButtonGroup
            name="kontrolljahreAb"
            dataSource={kontrolljahreAbWertes}
            loading={false}
            label="Kontrolljahre ab letzter"
            value={row.kontrolljahreAb}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.kontrolljahreAb}
          />
          <TypedRadioButtonGroup
            name="ekAbrechnungstyp"
            dataSource={
              dataEkAbrechnungstypWertes?.allEkAbrechnungstypWertes?.nodes ?? []
            }
            label="EK-Abrechnungstyp"
            value={row.ekAbrechnungstyp}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.ekAbrechnungstyp}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen"
            type="text"
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
          <TextField
            name="sort"
            label="Sortierung"
            type="number"
            value={row.sort}
            saveToDb={saveToDb}
            error={fieldErrors.sort}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
