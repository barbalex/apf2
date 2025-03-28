import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
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

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px 10px 0 10px;
`
const FormContainer = styled.div`
  padding: 10px 0;
`
const Spacer = styled.div`
  height: 500px;
`

const fieldTypes = {
  apId: 'UUID',
  artId: 'UUID',
}

export const Component = memo(
  observer(() => {
    const { taxonId: id } = useParams()

    const store = useContext(MobxContext)
    const client = useApolloClient()
    const queryClient = useQueryClient()

    const [fieldErrors, setFieldErrors] = useState({})

    const { data, loading, error, refetch } = useQuery(query, {
      variables: { id },
    })

    const row = useMemo(() => data?.apartById ?? {}, [data?.apartById])

    // do not include already choosen assozarten
    const apartenOfAp = (row?.apByApId?.apartsByApId?.nodes ?? [])
      .map((o) => o.artId)
      // but do include the art included in the row
      .filter((o) => o !== row.artId)
      // no null values
      .filter((o) => !!o)
    const aeTaxonomiesfilter = useCallback(
      (inputValue) =>
        inputValue ?
          apartenOfAp.length ?
            {
              taxArtName: { includesInsensitive: inputValue },
              id: { notIn: apartenOfAp },
            }
          : { taxArtName: { includesInsensitive: inputValue } }
        : { taxArtName: { isNull: false } },
      [apartenOfAp],
    )

    // do not show any artId's that have been used?
    // Nope: because some species have already been worked as separate ap
    // because apart did not exist...
    // maybe do later

    const saveToDb = useCallback(
      async (event) => {
        const field = event.target.name
        const value = ifIsNumericAsNumber(event.target.value)

        const variables = {
          id: row.id,
          [field]: value,
          changedBy: store.user.name,
        }
        try {
          await client.mutate({
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
        queryClient.invalidateQueries({
          queryKey: [`treeApart`],
        })
      },
      [client, queryClient, refetch, row.id, store.user.name],
    )

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="Taxon"
            MenuBarComponent={Menu}
          />
          <FieldsContainer>
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
            <FormContainer>
              <SelectLoadingOptions
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
              <Spacer />
            </FormContainer>
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
