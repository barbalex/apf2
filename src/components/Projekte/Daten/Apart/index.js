import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptions'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apart } from '../../../shared/fragments'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const FieldsSubContainer = styled.div`
  padding: 10px 10px 0 10px;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  apId: 'UUID',
  artId: 'UUID',
}

const ApArt = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const [fieldErrors, setFieldErrors] = useState({})

  const { data, loading, error, refetch } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
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
      inputValue
        ? apartenOfAp.length
          ? {
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
    },
    [client, refetch, row.id, store.user.name],
  )

  if (loading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Taxon"
          treeName={treeName}
          table="apart"
        />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FieldsSubContainer>
              <div>
                In der Art (= dem namensgebenden Taxon) eingeschlossenes Taxon.
                Gründe um mehrere zu erfassen:
                <ul>
                  <li>Die Art hat Synonyme</li>
                  <li>
                    Die Art umfasst nicht synonyme aber eng verwandte Arten
                    (z.B. Unterarten)
                  </li>
                  <li>
                    Beobachtungen liegen in unterschiedlichen Taxonomien vor,
                    z.B. SISF (2005) und DB-TAXREF (2017)
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
              </FormContainer>
            </FieldsSubContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApArt)
