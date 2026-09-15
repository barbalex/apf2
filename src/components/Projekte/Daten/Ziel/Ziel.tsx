import { useState } from 'react'
import { isEqual } from 'es-toolkit'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useParams, useLocation, useNavigate } from 'react-router'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { RadioButtonGroup } from '../../../shared/RadioButtonGroup.tsx'
import { TextField } from '../../../shared/TextField.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { Select } from '../../../shared/Select.tsx'
import { query } from './query.ts'
import {
  userNameAtom,
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { ziel as zielFragment } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type { ComponentType } from 'react'

import type { ZielId, ApId } from '../../../../models/apflora/index.ts'

interface ZielNode {
  id: ZielId
  apId: ApId
  typ: number | null
  jahr: number | null
  bezeichnung: string | null
  erreichung: string | null
  bemerkungen: string | null
  changedBy: string | null
}

interface ZielQueryResult {
  zielById: ZielNode | null
  allZielTypWertes: {
    nodes: {
      value: number
      label: string | null
    }[]
  }
}

// shared RadioButtonGroup's props are inferred from an untyped signature
// (dataSource infers as never, value as null);
// declare the shape this form passes
const TypedRadioButtonGroup = RadioButtonGroup as unknown as ComponentType<{
  name: string
  label: string
  dataSource: { value: number; label: string | null }[]
  value?: number | null | undefined
  saveToDb: (
    event: { target: { name?: string; value: string | number | null } },
  ) => void
  error?: string | undefined
}>

import styles from './Ziel.module.css'

const fieldTypes: Record<string, string> = {
  apId: 'UUID',
  typ: 'Int',
  jahr: 'Int',
  bezeichnung: 'String',
  erreichung: 'String',
  bemerkungen: 'String',
}

const erreichungOptions = [
  { value: 'erreicht', label: 'erreicht' },
  { value: 'nicht erreicht', label: 'nicht erreicht' },
  { value: 'unsicher', label: 'unsicher' },
]

export const Component = () => {
  const { zielId: id } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const userName = useAtomValue(userNameAtom)
  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useSuspenseQuery({
    queryKey: ['ziel', id],
    queryFn: async () => {
      const result = await apolloClient.query<ZielQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const row: Partial<ZielNode> = data?.zielById ?? {}

  const saveToDb = async (event: {
    target: { name?: string; value: unknown }
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
            mutation updateZiel(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateZielById(
                input: {
                  id: $id
                  zielPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                ziel {
                  ...ZielFields
                }
              }
            }
            ${zielFragment}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    void tsQueryClient.invalidateQueries({
      queryKey: ['ziel', id],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZiel`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZieljahrs`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeZielsOfJahr`],
    })
    // if jahr of ziel is updated, activeNodeArray und openNodes need to change
    if (field === 'jahr') {
      const newActiveNodeArray = [...activeNodeArray]
      newActiveNodeArray[5] = Number(value)
      const oldParentNodeUrl = activeNodeArray.toSpliced(-1)
      const newParentNodeUrl = newActiveNodeArray.toSpliced(-1)
      const newOpenNodes = openNodes.map((n) => {
        if (isEqual(n, activeNodeArray)) return newActiveNodeArray
        if (isEqual(n, oldParentNodeUrl)) return newParentNodeUrl
        return n
      })
      void navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
      setOpenNodes(newOpenNodes)
    }
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="Ziel"
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
          <TypedRadioButtonGroup
            name="typ"
            label="Zieltyp"
            dataSource={data?.allZielTypWertes?.nodes ?? []}
            value={row.typ}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.typ}
          />
          <TextField
            name="bezeichnung"
            label="Ziel"
            type="text"
            multiLine
            value={row.bezeichnung}
            saveToDb={saveToDb}
            error={fieldErrors.bezeichnung}
          />
          <h3 className={styles.subtitle}>Beurteilung</h3>
          <Select
            key={`${id}erreichung`}
            name="erreichung"
            label="Ziel-Erreichung"
            options={erreichungOptions}
            loading={false}
            value={row.erreichung ?? null}
            saveToDb={(event) => void saveToDb(event)}
            error={fieldErrors.erreichung ?? ''}
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
