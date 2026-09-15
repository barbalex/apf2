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
import { Select } from '../../../shared/Select.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopkontrzaehl } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type { TpopkontrzaehlId } from '../../../../models/apflora/Tpopkontrzaehl.ts'

interface TpopkontrzaehlNode {
  id: TpopkontrzaehlId
  einheit: number | null
  anzahl: number | null
  methode: number | null
}

interface TpopkontrzaehlQueryResult {
  tpopkontrzaehlById: TpopkontrzaehlNode | null
  allTpopkontrzaehlEinheitWertes: {
    nodes: {
      id: string
      value: number
      label: string
    }[]
  }
  allTpopkontrzaehlMethodeWertes: {
    nodes: {
      id: string
      value: number
      label: string
    }[]
  }
  otherZaehlOfEk: {
    nodes: {
      id: TpopkontrzaehlId
      einheit: number | null
    }[]
  }
}

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource: { value: number; label: string }[]
  value?: number | null | undefined
  saveToDb: (
    event: { target: { name?: string; value: string | number | null } },
  ) => void
  error?: string | undefined
}>

import styles from './index.module.css'

const fieldTypes: Record<string, string> = {
  anzahl: 'Float',
  einheit: 'Int',
  methode: 'Int',
}

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type TpopkontrzaehlUseQueryOptions = UseQueryOptions<
  TpopkontrzaehlQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const Component = () => {
  const { tpopkontrzaehlId, tpopkontrId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const tpopkontrzaehlQueryOptions: TpopkontrzaehlUseQueryOptions = {
    queryKey: ['tpopkontrzaehl', tpopkontrzaehlId, tpopkontrId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopkontrzaehlQueryResult>({
        query,
        variables: {
          id: tpopkontrzaehlId,
          tpopkontrId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }
  const { data } = useQuery(tpopkontrzaehlQueryOptions)

  const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)

  // filter out already used in other zaehlung of same kontr
  const zaehlEinheitOptions = (
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

  const row: Partial<TpopkontrzaehlNode> = data?.tpopkontrzaehlById ?? {}

  const saveToDb = async (event: {
    target: { name?: string; value: string | number | null }
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
            mutation updateAnzahlForEkZaehl(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopkontrzaehlById(
                input: {
                  id: $id
                  tpopkontrzaehlPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehl {
                  ...TpopkontrzaehlFields
                }
              }
            }
            ${tpopkontrzaehl}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // invalidate tpopkontrzaehl query
    void tsQueryClient.invalidateQueries({
      queryKey: ['tpopkontrzaehl', tpopkontrzaehlId, tpopkontrId],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeTpopfeldkontrzaehl`],
    })
  }

  // console.log('Tpopkontrzaehl rendering')

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Zählung"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <Select
            key={`${tpopkontrzaehlId}einheit`}
            name="einheit"
            label="Einheit"
            options={zaehlEinheitOptions}
            value={row.einheit ?? null}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.einheit ?? ''}
          />
          <TextField
            name="anzahl"
            label="Anzahl"
            type="number"
            value={row.anzahl}
            saveToDb={saveToDb}
            error={fieldErrors.anzahl}
          />
          <TypedRadioButtonGroup
            name="methode"
            label="Methode"
            dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
            value={row.methode}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.methode}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
