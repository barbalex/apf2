import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { tpopber } from '../../../shared/fragments'

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
  tpopId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Tpopber = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 9
          ? activeNodeArray[9]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'tpopberById', {})

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
            mutation updateTpopber(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateTpopberById(
                input: {
                  id: $id
                  tpopberPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopber {
                  ...TpopberFields
                }
              }
            }
            ${tpopber}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopberById: {
              tpopber: {
                ...variables,
                __typename: 'Tpopber',
              },
              __typename: 'Tpopber',
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
  if (errorLists) return `Fehler: ${errorLists.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Kontroll-Bericht Teil-Population"
          treeName={treeName}
          table="tpopber"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <TextField
                  name="jahr"
                  label="Jahr"
                  type="number"
                  handleSubmit={handleSubmit}
                />
                <RadioButtonGroup
                  name="entwicklung"
                  label="Entwicklung"
                  dataSource={get(
                    dataLists,
                    'allTpopEntwicklungWertes.nodes',
                    [],
                  )}
                  loading={loadingLists}
                  handleSubmit={handleSubmit}
                />
                <TextField
                  name="bemerkungen"
                  label="Bemerkungen"
                  type="text"
                  multiLine
                  handleSubmit={handleSubmit}
                />
              </Form>
            )}
          </Formik>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopber)
