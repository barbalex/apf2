import { apiFetch } from '../../../../modules/api.ts'
import { ekzaehleinheitSelect } from '../../../../modules/selects.ts'
import type { SaveToDbEvent } from '../../../shared/types.ts'
import { useState } from 'react'
import { useParams } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Menu } from './Menu.tsx'

import type {
  EkzaehleinheitId,
  ApId,
  TpopkontrzaehlEinheitWerteId,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'
import { apiUpdateByVariables } from '../../../../modules/api.ts'

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

export const Component = () => {
  const { zaehleinheitId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['ekzaehleinheit', id],
    queryFn: async () => {
      const rows = await apiFetch<
        NonNullable<EkzaehleinheitQueryResult['ekzaehleinheitById']>[]
      >(
        `/v_ekzaehleinheit?id=eq.${id}&select=${ekzaehleinheitSelect},tpopkontrzaehlEinheitWerteByZaehleinheitId:tpopkontrzaehl_einheit_werte_by_zaehleinheit_id,apByApId:ap_by_ap_id`,
      )
      return { ekzaehleinheitById: rows?.[0] ?? null }
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
  // phase 5: the notIn/isNull filter maps to PostgREST's not.in / not.is.null
  const zaehleinheitWerteParams =
    notToShow.length ? `id=not.in.(${notToShow.join(',')})` : 'id=not.is.null'
  const { data: dataLists } = useSuspenseQuery({
    queryKey: ['ekzaehleinheitLists', zaehleinheitWerteFilter],
    queryFn: async () => {
      const nodes = await apiFetch<
        {
          id: TpopkontrzaehlEinheitWerteId
          value: TpopkontrzaehlEinheitWerteId
          label: string | null
        }[]
      >(
        `/tpopkontrzaehl_einheit_werte?select=id,value:id,label:text&${zaehleinheitWerteParams}&order=sort.asc`,
      )
      return { allTpopkontrzaehlEinheitWertes: { nodes: nodes ?? [] } }
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
      await apiUpdateByVariables('ekzaehleinheit', variables)
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
