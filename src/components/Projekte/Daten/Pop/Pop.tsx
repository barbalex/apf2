import { useState, Suspense, type ChangeEvent } from 'react'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { TextFieldWithInfo } from '../../../shared/TextFieldWithInfo.tsx'
import { Status } from '../../../shared/Status.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { userNameAtom } from '../../../../store/index.ts'
import { Coordinates } from '../../../shared/Coordinates.tsx'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { pop } from '../../../shared/fragments.ts'
import { query } from './query.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Menu } from './Menu.tsx'

import type { PopFieldsFragment } from '../../../../gql/graphql.ts'

import styles from './Pop.module.css'

interface PopQueryResult {
  popById?: PopFieldsFragment & {
    apByApId?: {
      id: string
      startJahr: number | null
    }
  }
}

const fieldTypes: Record<string, string> = {
  apId: 'UUID',
  nr: 'Int',
  name: 'String',
  status: 'Int',
  statusUnklar: 'Boolean',
  statusUnklarBegruendung: 'String',
  bekanntSeit: 'Int',
}

export const Component = () => {
  const { popId } = useParams()

  const userName = useAtomValue(userNameAtom)

  const tsQueryClient = useQueryClient()
  const apolloClient = useApolloClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['pop', popId],
    queryFn: async () => {
      const result = await apolloClient.query<PopQueryResult>({
        query,
        variables: { id: popId },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row: Partial<NonNullable<PopQueryResult['popById']>> =
    data?.popById ?? {}

  const refetchForm = () => {
    void tsQueryClient.invalidateQueries({
      queryKey: ['pop', popId],
    })
  }

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
        mutation: dynamicGql`
            mutation updatePopForPop(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updatePopById(
                input: {
                  id: $id
                  popPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                pop {
                  ...PopFields
                }
              }
            }
            ${pop}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // update pop on map
    if (
      (value &&
        row &&
        ((field === 'lv95Y' && row.lv95X) ||
          (field === 'lv95X' && row.lv95Y))) ||
      (!value && (field === 'lv95Y' || field === 'lv95X'))
    ) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`PopForMapQuery`],
      })
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    // Invalidate queries to refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['pop', popId],
    })
    if (['name', 'nr'].includes(field)) {
      void tsQueryClient.invalidateQueries({
        queryKey: [`treePop`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <FormTitle
          title="Population"
          MenuBarComponent={Menu}
          menuBarProps={{ row }}
        />
        <div className={styles.formContainer}>
          <TextField
            label="Nr."
            name="nr"
            type="number"
            value={row.nr}
            saveToDb={saveToDb}
            error={fieldErrors.nr}
          />
          <TextFieldWithInfo
            label="Name"
            name="name"
            type="text"
            popover="Dieses Feld möglichst immer ausfüllen"
            value={row.name}
            saveToDb={saveToDb}
            error={fieldErrors.name}
          />
          <Status
            apJahr={row?.apByApId?.startJahr as null | undefined}
            showFilter={false}
            row={row}
            saveToDb={saveToDb}
            errors={fieldErrors}
          />
          <Checkbox2States
            label="Status unklar"
            name="statusUnklar"
            value={row.statusUnklar}
            saveToDb={saveToDb}
            error={fieldErrors.statusUnklar}
            helperText=""
          />
          <TextField
            label="Begründung"
            name="statusUnklarBegruendung"
            type="text"
            multiLine
            value={row.statusUnklarBegruendung}
            saveToDb={saveToDb}
            error={fieldErrors.statusUnklarBegruendung}
          />
          <Coordinates
            row={row}
            refetchForm={refetchForm}
            table="pop"
          />
        </div>
      </Suspense>
    </ErrorBoundary>
  )
}
