import { useState, type ChangeEvent } from 'react'
import { upperFirst } from 'es-toolkit'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useLocation } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type { TpopApberrelevantGrundWerteId } from '../../../../models/apflora/TpopApberrelevantGrundWerteId.ts'
import type { EkAbrechnungstypWerteCode } from '../../../../models/apflora/EkAbrechnungstypWerteCode.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'

interface WerteQueryResult {
  tpopApberrelevantGrundWerteById?: {
    id: TpopApberrelevantGrundWerteId
    code: number | null
    text: string | null
    sort: number | null
  }
  ekAbrechnungstypWerteById?: {
    id: string
    code: EkAbrechnungstypWerteCode | null
    text: string | null
    sort: number | null
  }
  tpopkontrzaehlEinheitWerteById?: {
    id: string
    code: TpopkontrzaehlEinheitWerteCode | null
    text: string | null
    sort: number | null
  }
}

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

  const query = gql`
    query werteByIdQuery($id: UUID!) {
      ${table}ById(id: $id) {
        id
        code
        text
        sort
      }
    }
  `
  const { data } = useQuery({
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
    suspense: true,
  })

  const row = data?.[`${table}ById`] ?? {}

  let codeGqlType = 'Int'
  let codeFieldType = 'number'
  if (['ekAbrechnungstypWerte'].includes(table)) {
    codeGqlType = 'String'
    codeFieldType = 'text'
  }

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }

    const typename = upperFirst(table)
    try {
      const mutation = gql`
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
    tsQueryClient.invalidateQueries({
      queryKey: ['werte', table, id],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (['text', 'sort'].includes(field)) {
      tsQueryClient.invalidateQueries({
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
