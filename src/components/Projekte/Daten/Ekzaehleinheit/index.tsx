import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.tsx'
import { Select } from '../../../shared/Select.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryLists } from './queryLists.ts'
import { MobxContext } from '../../../../mobxContext.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type {
  Ekzaehleinheit,
  ApId,
  TpopkontrzaehlEinheitWerteId,
} from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface EkzaehleinheitQueryResult {
  data?: {
    ekzaehleinheitById?: Ekzaehleinheit & {
      tpopkontrzaehlEinheitWerteByZaehleinheitId?: {
        id: TpopkontrzaehlEinheitWerteId
        text: string | null
      }
      apByApId?: {
        id: ApId
        ekzaehleinheitsByApId?: {
          nodes: Ekzaehleinheit[]
        }
      }
    }
  }
}

interface ListsQueryResult {
  data?: {
    allTpopkontrzaehlEinheitWertes?: {
      nodes: Array<{
        id: TpopkontrzaehlEinheitWerteId
        value: TpopkontrzaehlEinheitWerteId
        label: string | null
      }>
    }
  }
}

const fieldTypes = {
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  notMassnCountUnit: 'Boolean',
  sort: 'Int',
}

export const Component = observer(() => {
  const { zaehleinheitId: id } = useParams()

  const store = useContext(MobxContext)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<EkzaehleinheitQueryResult>(query, {
    variables: {
      id,
    },
  })

  const row = data?.ekzaehleinheitById ?? {}

  const ekzaehleinheitenOfAp = (
    row?.apByApId?.ekzaehleinheitsByApId?.nodes ?? []
  ).map((o) => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter((o) => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter =
    notToShow.length ? { id: { notIn: notToShow } } : { id: { isNull: false } }
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery<ListsQueryResult>(queryLists, {
    variables: {
      filter: zaehleinheitWerteFilter,
    },
  })

  const saveToDb = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: store.user.name,
    }
    try {
      await apolloClient.mutate({
        mutation: gql`
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
    if (['zaehleinheitId', 'sort'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
    }
  }

  // console.log('Ekzaehleinheit rendering, loading:', loading)

  if (loading) return <Spinner />

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
  ]
  if (errors.length) return <Error errors={errors} />

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
            loading={loadingLists}
            value={row.zaehleinheitId}
            saveToDb={saveToDb}
            error={fieldErrors.zaehleinheitId}
          />
          <Checkbox2States
            name="zielrelevant"
            label="zielrelevant"
            value={row.zielrelevant}
            saveToDb={saveToDb}
            error={fieldErrors.zielrelevant}
          />
          {row.zielrelevant && (
            <Checkbox2States
              name="notMassnCountUnit"
              label="Entspricht bewusst keiner Massnahmen-Zähleinheit ('Anzahl Pflanzen' oder 'Anzahl Triebe')"
              value={row.notMassnCountUnit}
              saveToDb={saveToDb}
              error={fieldErrors.notMassnCountUnit}
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
})
