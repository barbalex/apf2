import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form, Field } from 'formik'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { erfkrit } from '../../../shared/fragments'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
`

const fieldTypes = {
  apId: 'UUID',
  erfolg: 'Int',
  kriterien: 'String',
}

const Erfkrit = ({ treeName }) => {
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

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'erfkritById', {})

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
            mutation updateErfkrit(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateErfkritById(
                input: {
                  id: $id
                  erfkritPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                erfkrit {
                  ...ErfkritFields
                }
              }
            }
            ${erfkrit}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateErfkritById: {
              erfkrit: {
                ...variables,
                __typename: 'Erfkrit',
              },
              __typename: 'Erfkrit',
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
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="Erfolgs-Kriterium"
          treeName={treeName}
          table="erfkrit"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="erfolg"
                  label="Beurteilung"
                  dataSource={get(dataLists, 'allApErfkritWertes.nodes', [])}
                  loading={loadingLists}
                  component={RadioButtonGroup}
                />
                <Field
                  name="kriterien"
                  label="Kriterien"
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

export default observer(Erfkrit)
