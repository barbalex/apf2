import { useState, Suspense, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { queryAeTaxonomies } from './queryAeTaxonomies.ts'
import { userNameAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { apart } from '../../../shared/fragments.ts'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Menu } from './Menu.tsx'

import type Apart from '../../../../models/apflora/Apart.ts'
import type { ApartId } from '../../../../models/apflora/Apart.ts'
import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

import {
  container,
  fieldsContainer,
  formContainer,
  spacer,
} from './index.module.css'

const fieldTypes = {
  apId: 'UUID',
  artId: 'UUID',
}

interface ApartQueryResult {
  apartById: Apart & {
    aeTaxonomyByArtId?: {
      id: AeTaxonomiesId
      taxArtName: string
    }
    apByApId?: {
      id: ApId
      apartsByApId: {
        nodes: Array<Apart>
      }
    }
  }
}

export const Component = () => {
  const { taxonId: id } = useParams<{ taxonId: string }>()

  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { data, refetch } = useQuery({
    queryKey: ['apart', id],
    queryFn: async () => {
      const result = await apolloClient.query<ApartQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const row = data?.data?.apartById ?? {}

  // do not include already chosen assozarten
  const apartenOfAp = (row?.apByApId?.apartsByApId?.nodes ?? [])
    .map((o) => o.artId)
    // but do include the art included in the row
    .filter((o) => o !== row.artId)
    // no null values
    .filter((o) => !!o)
  const aeTaxonomiesfilter = (inputValue: string) =>
    inputValue ?
      apartenOfAp.length ?
        {
          taxArtName: { includesInsensitive: inputValue },
          id: { notIn: apartenOfAp },
        }
      : { taxArtName: { includesInsensitive: inputValue } }
    : { taxArtName: { isNull: false } }

  // do not show any artId's that have been used?
  // Nope: because some species have already been worked as separate ap
  // because apart did not exist...
  // maybe do later

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row.id,
      [field]: value,
      changedBy: userName,
    }
    try {
      await apolloClient.mutate<any>({
        mutation: gql`
            mutation updateApart(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateApartById(
                input: {
                  id: $id
                  apartPatch: {
                    ${field}: $${field}
                    changedBy: $changedBy
                  }
                }
              ) {
                apart {
                  ...ApartFields
                }
              }
            }
            ${apart}
          `,
        variables,
      })
    } catch (error) {
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    // Invalidate queries to refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['apart', id],
    })
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApart`],
    })
  }

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="Taxon"
          MenuBarComponent={Menu}
        />
        <div className={fieldsContainer}>
          <div>
            In der Art (= dem namensgebenden Taxon) eingeschlossenes Taxon.
            Gründe um mehrere zu erfassen:
            <ul>
              <li>Die Art hat Synonyme</li>
              <li>
                Die Art umfasst eng verwandte Arten, die nicht synonym sind
                (z.B. Unterarten)
              </li>
              <li>
                Beobachtungen liegen in unterschiedlichen Taxonomien vor, z.B.
                SISF (2005) und DB-TAXREF (2017)
              </li>
            </ul>
          </div>
          <div>
            {
              'Beobachtungen aller Taxa stehen im Ordner "Beobachtungen nicht beurteilt" zur Verfügung und können Teilpopulationen zugeordnet werden.'
            }
            <br />
            <br />
          </div>
          <div>
            Das namensgebende Taxon gibt nicht nur den Namen. Unter ihrer id
            werden auch die Kontrollen an InfoFlora geliefert.
            <br />
            <br />
          </div>
          <Suspense fallback={<Spinner />}>
            <div className={formContainer}>
              <SelectLoadingOptions
                key={`${row?.id}artId`}
                field="artId"
                valueLabel={row?.aeTaxonomyByArtId?.taxArtName ?? ''}
                label="Taxon"
                row={row}
                query={queryAeTaxonomies}
                filter={aeTaxonomiesfilter}
                queryNodesName="allAeTaxonomies"
                saveToDb={saveToDb}
                error={fieldErrors.artId}
              />
              <div className={spacer} />
            </div>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  )
}
