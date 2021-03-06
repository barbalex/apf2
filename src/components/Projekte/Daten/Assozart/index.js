import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

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
import Error from '../../../shared/Error'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
`

const fieldTypes = {
  bemerkungen: 'String',
  aeId: 'UUID',
  apId: 'UUID',
}

const Assozart = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { appBarHeight } = store
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
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

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

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-id="assozart" data-appbar-height={appBarHeight}>
        <FormTitle
          apId={row.apId}
          title="assoziierte Art"
          treeName={treeName}
          table="assozart"
          setFormTitleHeight={setFormTitleHeight}
        />
        <FieldsContainer data-form-title-height={formTitleHeight}>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
              {({ handleSubmit, dirty }) => (
                <StyledForm onBlur={() => dirty && handleSubmit()}>
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
                    handleSubmit={handleSubmit}
                  />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Assozart)
