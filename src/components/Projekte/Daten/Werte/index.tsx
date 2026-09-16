import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { upperFirst } from 'es-toolkit'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useLocation } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

// all wert tables return the same columns;
// the code column is an Int except for ekAbrechnungstypWerte (String)
interface WerteRow {
  id: string
  code: number | string | null
  text: string | null
  sort: number | null
}

type WerteQueryResult = Record<string, WerteRow | undefined>

import styles from './index.module.css'

export const Component = () => {
  const { wertId: id } = useParams()
  const location = useLocation()
  const { pathname } = location
  const table =
    pathname.includes('ApberrelevantGrundWerte') ? 'tpopApberrelevantGrundWerte'
    : pathname.includes('EkAbrechnungstypWerte') ? 'ekAbrechnungstypWerte'
    : pathname.includes('TpopkontrzaehlEinheitWerte') ?
      'tpopkontrzaehlEinheitWerte'
    : 'uups'

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const query = dynamicGql`
    query werteByIdQuery($id: UUID!) {
      ${table}ById(id: $id) {
        id
        code
        text
        sort
      }
    }
  `
  const { data } = useSuspenseQuery({
    queryKey: ['werte', table, id],
    queryFn: async () => {
      const result = await apolloClient.query<WerteQueryResult>({
        query,
        variables: {
          id,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row: Partial<WerteRow> = data?.[`${table}ById`] ?? {}

  let codeGqlType = 'Int'
  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(table)) {
    codeGqlType = 'String'
    codeFieldType = 'text'
  }

  const saveToDb = async (event: SaveToDbEvent) => {
    const field = event.target.name ?? ''
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }

    const typename = upperFirst(table)
    try {
      const mutation = dynamicGql`
          mutation updateWert(
            $id: UUID!
            $code: ${codeGqlType}
            $text: String
            $sort: Int
            $changedBy: String
          ) {
            update${typename}ById(
              input: {
                id: $id
                ${table}Patch: {
                  id: $id
                  code: $code
                  text: $text
                  sort: $sort
                  changedBy: $changedBy
                }
              }
            ) {
              ${table} {
                id
                code
                text
                sort
                changedBy
              }
            }
          }
        `
      await apolloClient.mutate({
        mutation,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    void tsQueryClient.invalidateQueries({
      queryKey: ['werte', table, id],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['text', 'sort'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`tree${upperFirst(table)}`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title={table}
          MenuBarComponent={Menu}
          menuBarProps={{ row, table }}
        />
        <div className={styles.formContainer}>
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
            type={codeFieldType}
            value={row.code}
            saveToDb={saveToDb}
            error={fieldErrors.code}
          />
          <TextField
            name="sort"
            label="Sort"
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
