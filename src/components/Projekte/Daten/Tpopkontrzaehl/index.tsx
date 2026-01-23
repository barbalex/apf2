import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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

import type { TpopkontrzaehlId } from '../../../../models/apflora/TpopkontrzaehlId.ts'
import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../models/apflora/TpopkontrzaehlEinheitWerteCode.ts'
import type { TpopkontrzaehlMethodeWerteCode } from '../../../../models/apflora/TpopkontrzaehlMethodeWerteCode.ts'

interface TpopkontrzaehlQueryResult {
  tpopkontrzaehlById: {
    id: TpopkontrzaehlId
    einheit: TpopkontrzaehlEinheitWerteCode | null
    anzahl: number | null
    methode: TpopkontrzaehlMethodeWerteCode | null
  } | null
  allTpopkontrzaehlEinheitWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlEinheitWerteCode
      label: string
    }>
  }
  allTpopkontrzaehlMethodeWertes: {
    nodes: Array<{
      id: string
      value: TpopkontrzaehlMethodeWerteCode
      label: string
    }>
  }
  otherZaehlOfEk: {
    nodes: Array<{
      id: TpopkontrzaehlId
      einheit: TpopkontrzaehlEinheitWerteCode | null
    }>
  }
}

import styles from './index.module.css'

const fieldTypes = {
  anzahl: 'Float',
  einheit: 'Int',
  methode: 'Int',
}

export const Component = () => {
  const { tpopkontrzaehlId, tpopkontrId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery<TpopkontrzaehlQueryResult>({
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
  })

  const zaehlEinheitCodesAlreadyUsed = (data?.otherZaehlOfEk?.nodes ?? [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)

  // filter out already used in other zaehlung of same kontr
  const zaehlEinheitOptions = (
    data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  ).filter((o) => !zaehlEinheitCodesAlreadyUsed.includes(o.value))

  const row = data?.tpopkontrzaehlById ?? {}

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
    tsQueryClient.invalidateQueries({
      queryKey: ['tpopkontrzaehl', tpopkontrzaehlId, tpopkontrId],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    tsQueryClient.invalidateQueries({
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
            value={row.einheit}
            saveToDb={saveToDb}
            error={fieldErrors.einheit}
          />
          <TextField
            name="anzahl"
            label="Anzahl"
            type="number"
            value={row.anzahl}
            saveToDb={saveToDb}
            error={fieldErrors.anzahl}
          />
          <RadioButtonGroup
            name="methode"
            label="Methode"
            dataSource={data?.allTpopkontrzaehlMethodeWertes?.nodes ?? []}
            value={row.methode}
            saveToDb={saveToDb}
            error={fieldErrors.methode}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
