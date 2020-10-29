import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

import SelectLoadingOptions from '../../../shared/SelectLoadingOptionsFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import queryAeEigById from './queryAeEigById'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apart } from '../../../shared/fragments'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: calc(100vh - 64px);
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const FieldsSubContainer = styled.div`
  padding: 10px 10px 0 10px;
`

const fieldTypes = {
  apId: 'UUID',
  artId: 'UUID',
}

const ApArt = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 5
          ? activeNodeArray[5]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'apartById', {})

  const {
    data: dataAeEigById,
    loading: loadingAeEigById,
    error: errorAeEigById,
  } = useQuery(queryAeEigById, {
    variables: {
      id: row && row.artId ? row.artId : '99999999-9999-9999-9999-999999999999',
    },
  })

  // do not include already choosen assozarten
  const apartenOfAp = get(row, 'apByApId.apartsByApId.nodes', [])
    .map((o) => o.artId)
    // but do include the art included in the row
    .filter((o) => o !== row.artId)
    // no null values
    .filter((o) => !!o)
  const aeTaxonomiesfilter = useCallback(
    (inputValue) =>
      !!inputValue
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

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateApart(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateApartById(
                input: {
                  id: $id
                  apartPatch: {
                    ${changedField}: $${changedField}
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
          optimisticResponse: {
            __typename: 'Mutation',
            updateApartById: {
              apart: {
                ...variables,
                __typename: 'Apart',
              },
              __typename: 'Apart',
            },
          },
        })
      } catch (error) {
        return setErrors({ [changedField]: error.message })
      }
      setErrors({})
    },
    [client, row, store.user.name],
  )

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  if (loading || loadingAeEigById) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }

  const errors = [
    ...(error ? [error] : []),
    ...(errorAeEigById ? [errorAeEigById] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Aktionsplan-Art"
          treeName={treeName}
          table="apart"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FieldsSubContainer>
              <div>
                "Aktionsplan-Arten" sind alle Arten, welche der Aktionsplan
                behandelt. Häufig dürfte das bloss eine einzige Art sein.
                Folgende Gründe können dazu führen, dass hier mehrere
                aufgelistet werden:
                <ul>
                  <li>Die AP-Art hat Synonyme</li>
                  <li>
                    Beobachtungen liegen in unterschiedlichen Taxonomien vor,
                    z.B. SISF 2 und SISF 3 bzw. Checklist 2017
                  </li>
                  <li>
                    Wenn eine Art im Rahmen des Aktionsplans inklusive nicht
                    synonymer aber eng verwandter Arten gefasst wid (z.B.
                    Unterarten)
                  </li>
                </ul>
              </div>
              <div>
                Beobachtungen aller AP-Arten stehen im Ordner "Beobachtungen
                nicht beurteilt" zur Verfügung und können Teilpopulationen
                zugeordnet werden.
                <br />
                <br />
              </div>
              <div>
                Die im Aktionsplan gewählte namensgebende Art gibt dem
                Aktionsplan nicht nur den Namen. Unter ihrer id werden auch die
                Kontrollen an InfoFlora geliefert.
                <br />
                <br />
              </div>
              <Formik
                initialValues={row}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ handleSubmit, dirty }) => (
                  <Form
                    key={row ? row.id : 'artid'}
                    onBlur={() => dirty && handleSubmit()}
                  >
                    <SelectLoadingOptions
                      name="artId"
                      valueLabel={
                        dataAeEigById.aeTaxonomyById
                          ? dataAeEigById.aeTaxonomyById.taxArtName
                          : ''
                      }
                      label="Art"
                      row={row}
                      query={queryAeTaxonomies}
                      filter={aeTaxonomiesfilter}
                      queryNodesName="allAeTaxonomies"
                      handleSubmit={handleSubmit}
                    />
                  </Form>
                )}
              </Formik>
            </FieldsSubContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(ApArt)
