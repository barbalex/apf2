import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { MobxContext } from '../../../../mobxContext.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopber } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type {
  TpopberId,
  TpopId,
  TpopEntwicklungWerteCode,
} from '../../../../generated/apflora/models.ts'

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

const fieldTypes = {
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

export const Component = observer(() => {
  const { tpopberId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery<TpopberQueryResult>({
    queryKey: ['tpopber', tpopberId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopberQueryResult>({
        query: gql`
          query tpopberByIdQuery($id: UUID!) {
            tpopberById(id: $id) {
              ...TpopberFields
            }
            allTpopEntwicklungWertes(orderBy: SORT_ASC) {
              nodes {
                value: code
                label: text
              }
            }
          }
          ${tpopber}
        `,
        variables: { id: tpopberId },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.tpopberById

  const saveToDb = async (event) => {
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
    tsQueryClient.invalidateQueries({ queryKey: ['tpopber', tpopberId] })
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    if (['jahr', 'entwicklung'].includes(field)) {
      tsQueryClient.invalidateQueries({
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
            dataSource={data?.allTpopEntwicklungWertes?.nodes ?? []}
            value={row.entwicklung}
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
})
