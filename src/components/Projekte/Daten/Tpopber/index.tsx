import { useState } from 'react'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import {
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopber } from '../../../shared/fragments.ts'
import { query } from './query.ts'
import { Menu } from './Menu.tsx'

import type { TpopId, TpopEntwicklungWerteCode } from '../../../../models/apflora/index.ts'
import type { TpopberId } from '../../../../models/apflora/Tpopber.ts'

import styles from './index.module.css'

interface TpopberQueryResult {
  tpopberById?: {
    id: TpopberId
    tpopId: TpopId
    jahr?: number | null
    entwicklung?: TpopEntwicklungWerteCode | null
    bemerkungen?: string | null
    changedBy?: string | null
  } | null
  allTpopEntwicklungWertes?: {
    nodes: {
      value: TpopEntwicklungWerteCode
      label?: string | null
    }[]
  } | null
}

const fieldTypes: Record<string, string> = {
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopberUseQueryOptions = UseQueryOptions<
  TpopberQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const Component = () => {
  const { tpopberId } = useParams()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const tpopberQueryOptions: TpopberUseQueryOptions = {
    queryKey: ['tpopber', tpopberId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopberQueryResult>({
        query,
        variables: { id: tpopberId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }
  const { data } = useQuery(tpopberQueryOptions)

  const row = (data?.tpopberById ?? {}) as NonNullable<
    TpopberQueryResult['tpopberById']
  >
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
              mutation updateTpopber(
                $id: UUID!
                $${field}: ${fieldTypes[field]}
                $changedBy: String
              ) {
                updateTpopberById(
                  input: {
                    id: $id
                    tpopberPatch: {
                      ${field}: $${field}
                      changedBy: $changedBy
                    }
                  }
                ) {
                  tpopber { ...TpopberFields }
                }
              }
              ${tpopber}
            `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopber query
    void tsQueryClient.invalidateQueries({ queryKey: ['tpopber', tpopberId] })
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    if (['jahr', 'entwicklung'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopber`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Kontroll-Bericht Teil-Population"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <TextField
            name="jahr"
            label="Jahr"
            type="number"
            value={row.jahr}
            saveToDb={saveToDb}
            error={fieldErrors.jahr}
          />
          <RadioButtonGroup
            name="entwicklung"
            label="Entwicklung"
            dataSource={(data?.allTpopEntwicklungWertes?.nodes ?? []) as never[]}
            value={row.entwicklung as null}
            saveToDb={saveToDb}
            error={fieldErrors.entwicklung}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen"
            type="text"
            value={row.bemerkungen}
            multiLine
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
