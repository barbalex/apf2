import { useContext, useState, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { SelectLoadingOptions } from '../../../shared/SelectLoadingOptions.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { queryAeTaxonomies } from './queryAeTaxonomies.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { apart } from '../../../shared/fragments.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Menu } from './Menu.jsx'

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

export const Component = observer(() => {
  const { taxonId: id } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, error, refetch } = useQuery(query, {
    variables: { id },
  })

  const row = data?.apartById ?? {}

  // do not include already chosen assozarten
  const apartenOfAp = (row?.apByApId?.apartsByApId?.nodes ?? [])
    .map((o) => o.artId)
    // but do include the art included in the row
    .filter((o) => o !== row.artId)
    // no null values
    .filter((o) => !!o)
  const aeTaxonomiesfilter = (inputValue) =>
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
      return setFieldErrors({ [field]: error.message })
    }
    // without refetch artname is not renewed
    refetch()
    setFieldErrors({})
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApart`],
    })
  }

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <div className={container}>
        <FormTitle
          title="Taxon"
          MenuBarComponent={Menu}
        />
        <div className={fieldsContainer}>
          <Suspense fallback={<Spinner />}>
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
})
