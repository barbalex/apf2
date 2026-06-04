import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
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

export const Component = () => {
  const { popberId: id } = useParams()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['popber', id],
    queryFn: async () => {
      const result = await apolloClient.query<PopberQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const row = data?.popberById ?? {}

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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // only set if necessary (to reduce renders)
    if (Object.keys(fieldErrors).length) {
      setFieldErrors((prev) => {
        const { [field]: _, ...rest } = prev
        return rest
      })
    }
    // Invalidate queries to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['popber', id],
    })
    if (['jahr', 'entwicklung'].includes(field)) {
      tsQueryClient.invalidateQueries({
        queryKey: [`treePopber`],
      })
    }
  }

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
}
