import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import TextField from '../../../shared/TextFieldFormik'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptionsFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryAeTaxonomies from './queryAeTaxonomies'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { assozart } from '../../../shared/fragments'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  overflow: auto !important;
  padding: 10px;
  height: 100%;
`

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

const Assozart = ({ treeName }) => {
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

  const row = get(data, 'assozartById', {})

  // do not include already choosen assozarten
  const assozartenOfAp = get(row, 'apByApId.assozartsByApId.nodes', [])
    .map((o) => o.aeId)
    // but do include the art included in the row
    .filter((o) => o !== row.aeId)
  const aeTaxonomiesfilter = (inputValue) =>
    !!inputValue
      ? assozartenOfAp.length
        ? {
            taxArtName: { includesInsensitive: inputValue },
            id: { notIn: assozartenOfAp },
          }
        : { taxArtName: { includesInsensitive: inputValue } }
      : { taxArtName: { isNull: false } }

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
            mutation updateAssozart(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateAssozartById(
                input: {
                  id: $id
                  assozartPatch: {
                    ${changedField}: $${changedField}
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
          optimisticResponse: {
            __typename: 'Mutation',
            updateAssozartById: {
              assozart: {
                ...variables,
                __typename: 'Assozart',
              },
              __typename: 'Assozart',
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

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler beim Laden der Daten: ${error.message}`

  return (
    <ErrorBoundary>
      <Container data-id="assozart">
        <FormTitle
          apId={row.apId}
          title="assoziierte Art"
          treeName={treeName}
          table="assozart"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <SelectLoadingOptions
                  name="aeId"
                  valueLabelPath="aeTaxonomyByAeId.taxArtName"
                  label="Art"
                  row={row}
                  query={queryAeTaxonomies}
                  filter={aeTaxonomiesfilter}
                  queryNodesName="allAeTaxonomies"
                  handleSubmit={handleSubmit}
                />
                <TextField
                  name="bemerkungen"
                  label="Bemerkungen zur Assoziation"
                  type="text"
                  multiLine
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Assozart)
