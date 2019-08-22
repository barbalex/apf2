import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import SelectLoadingOptions from '../../../shared/SelectLoadingOptionsFormik'
import FormTitle from '../../../shared/FormTitle'
import updateAssozartByIdGql from './updateAssozartById'
import query from './query'
import queryAeEigenschaftens from './queryAeEigenschaftens'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

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

const Assozart = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
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
    .map(o => o.aeId)
    // but do include the art included in the row
    .filter(o => o !== row.aeId)
  const aeEigenschaftenfilter = inputValue =>
    !!inputValue
      ? assozartenOfAp.length
        ? {
            artname: { includesInsensitive: inputValue },
            id: { notIn: assozartenOfAp },
          }
        : { artname: { includesInsensitive: inputValue } }
      : { artname: { isNull: false } }

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      try {
        await client.mutate({
          mutation: updateAssozartByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateAssozartById: {
              assozart: {
                ...values,
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
      if (['aeId'].includes(changedField)) refetch.assozarts()
    },
    [client, refetch, row, store.user.name],
  )

  if (loading) {
    return (
      <Container>
        <FieldsContainer>Lade...</FieldsContainer>
      </Container>
    )
  }
  if (error) return `Fehler: ${error.message}`

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
                <Field
                  name="aeId"
                  valueLabelPath="aeEigenschaftenByAeId.artname"
                  label="Art"
                  row={row}
                  query={queryAeEigenschaftens}
                  filter={aeEigenschaftenfilter}
                  queryNodesName="allAeEigenschaftens"
                  component={SelectLoadingOptions}
                />
                <Field
                  name="bemerkungen"
                  label="Bemerkungen zur Assoziation"
                  type="text"
                  multiLine
                  component={TextField}
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
