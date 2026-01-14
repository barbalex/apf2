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
import { Spinner } from '../../../shared/Spinner.tsx'
import { Error } from '../../../shared/Error.tsx'
import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type {
  PopberId,
  PopId,
  TpopEntwicklungWerteCode,
} from '../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface PopberQueryResult {
  popberById?: {
    id: PopberId
    popId: PopId
    jahr: number | null
    entwicklung: TpopEntwicklungWerteCode | null
    bemerkungen: string | null
    tpopEntwicklungWerteByEntwicklung?: {
      code: TpopEntwicklungWerteCode
      text: string | null
      sort: number | null
    }
    popByPopId?: {
      id: PopId
      nr: number | null
      name: string | null
    }
  }
  allTpopEntwicklungWertes?: {
    nodes: Array<{
      value: TpopEntwicklungWerteCode
      label: string | null
    }>
  }
}

const fieldTypes = {
  popId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

export const Component = observer(() => {
  const { popberId: id } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, loading, error } = useQuery<PopberQueryResult>(query, {
    variables: {
      id,
    },
  })

  const row = data?.popberById ?? {}

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
          mutation updatePopber(
            $id: UUID!
            $${field}: ${fieldTypes[field]}
            $changedBy: String
          ) {
            updatePopberById(
              input: {
                id: $id
                popberPatch: {
                  ${field}: $${field}
                  changedBy: $changedBy
                }
              }
            ) {
              popber {
                ...PopberFields
                tpopEntwicklungWerteByEntwicklung {
                  ...TpopEntwicklungWerteFields
                }
                popByPopId {
                  ...PopFields
                }
              }
            }
          }
          ${pop}
          ${popber}
          ${tpopEntwicklungWerte}
        `,
        variables,
      })
    } catch (error) {
      return setFieldErrors({ [field]: (error as Error).message })
    }
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors({})
    }
    if (['jahr', 'entwicklung'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopber`],
      })
    }
  }

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Kontroll-Bericht Population"
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
            loading={loading}
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
