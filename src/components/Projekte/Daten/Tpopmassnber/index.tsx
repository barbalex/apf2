import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { MobxContext } from '../../../../mobxContext.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { tpopmassnber } from '../../../shared/fragments.ts'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type { TpopmassnberId } from '../../../../models/apflora/TpopmassnberId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'
import type { PopId } from '../../../../models/apflora/PopId.ts'
import type { ApId } from '../../../../models/apflora/ApId.ts'
import type { TpopmassnErfbeurtWerteCode } from '../../../../models/apflora/TpopmassnErfbeurtWerteCode.ts'

interface TpopmassnberQueryResult {
  tpopmassnberById: {
    id: TpopmassnberId
    jahr: number | null
    beurteilung: TpopmassnErfbeurtWerteCode | null
    bemerkungen: string | null
    tpopId: TpopId
    changedBy: string | null
    tpopByTpopId: {
      id: TpopId
      popByPopId: {
        id: PopId
        apId: ApId
      }
    }
  } | null
  allTpopmassnErfbeurtWertes: {
    nodes: Array<{
      value: TpopmassnErfbeurtWerteCode
      label: string
    }>
  }
}

import styles from './index.module.css'

const fieldTypes = {
  tpopId: 'UUID',
  jahr: 'Int',
  beurteilung: 'Int',
  bemerkungen: 'String',
}

export const Component = observer(() => {
  const { tpopmassnberId: id } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<TpopmassnberQueryResult>(query, {
    variables: {
      id,
    },
  })

  const row = data?.tpopmassnberById ?? {}

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
            mutation updateTpopmassnber(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateTpopmassnberById(
                input: {
                  id: $id
                  tpopmassnberPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopmassnber {
                  ...TpopmassnberFields
                  tpopByTpopId {
                    id
                    popByPopId {
                      id
                      apId
                    }
                  }
                }
              }
            }
            ${tpopmassnber}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    setFieldErrors({})
    if (['jahr', 'beurteilung'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeTpopmassnber`],
      })
    }
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Massnahmen-Bericht Teil-Population"
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
            name="beurteilung"
            label="Entwicklung"
            dataSource={data?.allTpopmassnErfbeurtWertes?.nodes ?? []}
            loading={loading}
            value={row.beurteilung}
            saveToDb={saveToDb}
            error={fieldErrors.beurteilung}
          />
          <TextField
            name="bemerkungen"
            label="Interpretation"
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
