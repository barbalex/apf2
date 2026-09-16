import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryLists } from './queryLists.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type {
  EkzaehleinheitId,
  ApId,
  TpopkontrzaehlEinheitWerteId,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface EkzaehleinheitNode {
  id: EkzaehleinheitId
  apId: ApId
  label: string | null
  zaehleinheitId: TpopkontrzaehlEinheitWerteId | null
  zielrelevant: boolean | null
  notMassnCountUnit: boolean | null
  sort: number | null
  bemerkungen: string | null
  changedBy: string | null
  tpopkontrzaehlEinheitWerteByZaehleinheitId: {
    id: TpopkontrzaehlEinheitWerteId
    code: number | null
    text: string | null
    correspondsToMassnAnzTriebe: boolean | null
    correspondsToMassnAnzPflanzen: boolean | null
    sort: number | null
    historic: boolean | null
    label: string | null
    changedBy: string | null
  } | null
  apByApId: {
    id: ApId
    ekzaehleinheitsByApId: {
      nodes: EkzaehleinheitNode[]
    }
  }
}

interface EkzaehleinheitQueryResult {
  ekzaehleinheitById: EkzaehleinheitNode | null
}

interface ListsQueryResult {
  allTpopkontrzaehlEinheitWertes: {
    nodes: {
      id: TpopkontrzaehlEinheitWerteId
      value: TpopkontrzaehlEinheitWerteId
      label: string | null
    }[]
  }
}

const fieldTypes: Record<string, string> = {
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  notMassnCountUnit: 'Boolean',
  sort: 'Int',
}

export const Component = () => {
  const { zaehleinheitId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['ekzaehleinheit', id],
    queryFn: async () => {
      const result = await apolloClient.query<EkzaehleinheitQueryResult>({
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

  const row: Partial<EkzaehleinheitNode> = data?.ekzaehleinheitById ?? {}

  const ekzaehleinheitenOfAp = (
    row?.apByApId?.ekzaehleinheitsByApId?.nodes ?? []
  ).map((o) => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter((o) => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter =
    notToShow.length ? { id: { notIn: notToShow } } : { id: { isNull: false } }
  const { data: dataLists } = useSuspenseQuery({
    queryKey: ['ekzaehleinheitLists', zaehleinheitWerteFilter],
    queryFn: async () => {
      const result = await apolloClient.query<ListsQueryResult>({
        query: queryLists,
        variables: {
          filter: zaehleinheitWerteFilter,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const saveToDb = async (event: SaveToDbEvent) => {
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
            mutation updateEkzaehleinheit(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateEkzaehleinheitById(
                input: {
                  id: $id
                  ekzaehleinheitPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekzaehleinheit {
                  ...EkzaehleinheitFields
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
                  }
                }
              }
            }
            ${ekzaehleinheit}
            ${tpopkontrzaehlEinheitWerte}
          `,
        variables,
      })
    } catch (error) {
      if (
        field === 'zielrelevant' &&
        ((error as Error).message.includes('doppelter Schlüsselwert') ||
          (error as Error).message.includes('duplicate key value'))
      ) {
        return setFieldErrors({
          [field]: 'Pro Art darf nur eine Einheit zielrelevant sein',
        })
      }
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate query to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['ekzaehleinheit', id],
    })
    if (['zaehleinheitId', 'sort'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
    }
  }

  // console.log('Ekzaehleinheit rendering, loading:', loading)

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="EK-Zähleinheit"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <Select
            key={`${id}zaehleinheitId`}
            name="zaehleinheitId"
            label="Zähleinheit"
            options={dataLists?.allTpopkontrzaehlEinheitWertes?.nodes ?? []}
            value={row.zaehleinheitId ?? null}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.zaehleinheitId ?? ''}
          />
          <Checkbox2States
            name="zielrelevant"
            label="zielrelevant"
            value={row.zielrelevant}
            saveToDb={saveToDb}
            error={fieldErrors.zielrelevant}
            helperText={undefined}
          />
          {row.zielrelevant && (
            <Checkbox2States
              name="notMassnCountUnit"
              label="Entspricht bewusst keiner Massnahmen-Zähleinheit ('Anzahl Pflanzen' oder 'Anzahl Triebe')"
              value={row.notMassnCountUnit}
              saveToDb={saveToDb}
              error={fieldErrors.notMassnCountUnit}
              helperText={undefined}
            />
          )}
          <TextField
            name="sort"
            label="Sortierung"
            type="number"
            value={row.sort}
            saveToDb={saveToDb}
            error={fieldErrors.sort}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen"
            type="text"
            multiLine
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
