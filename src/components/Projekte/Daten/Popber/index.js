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
import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments'

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
  popId: 'UUID',
  jahr: 'Int',
  entwicklung: 'Int',
  bemerkungen: 'String',
}

const Popber = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 7
          ? activeNodeArray[7]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists)

  const row = get(data, 'popberById', {})

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
            mutation updatePopber(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updatePopberById(
                input: {
                  id: $id
                  popberPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                popber {
                  ...PopberFields
                  tpopEntwicklungWerteByEntwicklung {
                    ...TpopEntwicklungWerteFields
                  }
                  popByPopId {
                    ...PopFields
                  }
                }
              }
            }
            ${pop}
            ${popber}
            ${tpopEntwicklungWerte}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updatePopberById: {
              popber: {
                ...variables,
                __typename: 'Popber',
              },
              __typename: 'Popber',
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
          apId={get(data, 'popberById.popByPopId.apId')}
          title="Kontroll-Bericht Population"
          treeName={treeName}
          table="popber"
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

export default observer(Popber)
