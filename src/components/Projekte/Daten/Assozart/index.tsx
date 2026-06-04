import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { assozart } from '../../../shared/fragments.ts'
import { Menu } from './Menu.tsx'

import type Assozart from '../../../../models/apflora/Assozart.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'

import styles from './index.module.css'

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

interface AssozartQueryResult {
  assozartById: Assozart & {
    aeTaxonomyByAeId?: {
      taxArtName: string
    }
    apByApId?: {
      artId: AeTaxonomiesId
      assozartsByApId: {
        nodes: Array<Assozart>
      }
    }
  }
}

export const Component = () => {
  const { assozartId: id } = useParams<{ assozartId: string }>()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data } = useQuery({
    queryKey: ['assozart', id],
    queryFn: async () => {
      const result = await apolloClient.query<AssozartQueryResult>({
        query,
        variables: {
          id,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const row = data.assozartById as AssozartQueryResult['assozartById']

  // do not include already chosen assozarten
  const assozartenOfAp = (row?.apByApId?.assozartsByApId?.nodes ?? [])
    .map((o) => o.aeId)
    // but do include the art included in the row
    .filter((o) => o !== row.aeId)
  const aeTaxonomiesfilter = (inputValue: string) =>
    inputValue ?
      assozartenOfAp.length ?
        {
          taxArtName: { includesInsensitive: inputValue },
          id: { notIn: assozartenOfAp },
        }
      : { taxArtName: { includesInsensitive: inputValue } }
    : { taxArtName: { isNull: false } }

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
                mutation updateAssozart(
                  $id: UUID!
                  $${field}: ${fieldTypes[field]}
                  $changedBy: String
                ) {
                  updateAssozartById(
                    input: {
                      id: $id
                      assozartPatch: {
                        ${field}: $${field}
                        changedBy: $changedBy
                      }
                    }
                  ) {
                    assozart {
                      ...AssozartFields
                      aeTaxonomyByAeId {
                        id
                        artname
                      }
                      apByApId {
                        artId
                        assozartsByApId {
                          nodes {
                            ...AssozartFields
                          }
                        }
                      }
                    }
                  }
                }
                ${assozart}
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
    // Invalidate query to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['assozart', id],
    })
    if (field === 'aeId') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeAssozart`],
      })
    }
  }

  return (
    <ErrorBoundary>
      <div
        className={styles.container}
        data-id="assozart"
      >
        <FormTitle
          title="assoziierte Art"
          MenuBarComponent={Menu}
        />
        <div className={styles.formContainer}>
          <SelectLoadingOptions
            key={`${id}aeId`}
            field="aeId"
            valueLabelPath="aeTaxonomyByAeId.taxArtName"
            label="Art"
            row={row}
            query={queryAeTaxonomies}
            filter={aeTaxonomiesfilter}
            queryNodesName="allAeTaxonomies"
            value={row.aeId}
            saveToDb={saveToDb}
            error={fieldErrors.aeId}
          />
          <TextField
            name="bemerkungen"
            label="Bemerkungen zur Assoziation"
            type="text"
            value={row.bemerkungen}
            saveToDb={saveToDb}
            error={fieldErrors.bemerkungen}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}
