import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import queryZaehlOfEk from './queryZaehlOfEk'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { tpopkontrzaehl } from '../../../shared/fragments'

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
  anzahl: 'Int',
  einheit: 'Int',
  methode: 'Int',
}

const Tpopkontrzaehl = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { activeNodeArray } = store[treeName]

  const tpopkontrzaehlId =
    activeNodeArray.length > 11
      ? activeNodeArray[11]
      : '99999999-9999-9999-9999-999999999999'
  const tpopkontrId =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'
  const { data, loading, error } = useQuery(query, {
    variables: {
      id: tpopkontrzaehlId,
    },
  })

  const { data: dataZaehlOfEk, error: errorZaehlOfEk } = useQuery(
    queryZaehlOfEk,
    {
      variables: {
        tpopkontrId,
        id: tpopkontrzaehlId,
      },
    },
  )

  const codes = get(dataZaehlOfEk, 'allTpopkontrzaehls.nodes', [])
    .map((n) => n.einheit)
    // prevent null values which cause error in query
    .filter((e) => !!e)
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists, {
    variables: {
      codes,
    },
  })

  const row = get(data, 'tpopkontrzaehlById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      /**
       * TODO:
       * this is an experiment
       * see if single field mutations work
       * maybe solve race conditions on mutating:
       * https://github.com/barbalex/apf2/issues/395
       */
      try {
        await client.mutate({
          mutation: gql`
            mutation updateAnzahlForEkZaehl(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateTpopkontrzaehlById(
                input: {
                  id: $id
                  tpopkontrzaehlPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                tpopkontrzaehl {
                  ...TpopkontrzaehlFields
                }
              }
            }
            ${tpopkontrzaehl}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                ...variables,
                __typename: 'Tpopkontrzaehl',
              },
              __typename: 'Tpopkontrzaehl',
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
  if (error) return error.message
  if (errorLists) return errorLists.message
  if (errorZaehlOfEk) return errorZaehlOfEk.message
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Zählung"
          treeName={treeName}
          table="tpopkontrzaehl"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Select
                  name="einheit"
                  label="Einheit"
                  options={get(
                    dataLists,
                    'allTpopkontrzaehlEinheitWertes.nodes',
                    [],
                  )}
                  loading={loadingLists}
                  handleSubmit={handleSubmit}
                />
                <TextField
                  name="anzahl"
                  label="Anzahl (nur ganze Zahlen)"
                  type="number"
                  handleSubmit={handleSubmit}
                />
                <RadioButtonGroup
                  name="methode"
                  label="Methode"
                  dataSource={get(
                    dataLists,
                    'allTpopkontrzaehlMethodeWertes.nodes',
                    [],
                  )}
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

export default observer(Tpopkontrzaehl)
