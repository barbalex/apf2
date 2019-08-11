import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import RadioButtonGroup from '../../../shared/RadioButtonGroupFormik'
import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import queryZaehlOfEk from './queryZaehlOfEk'
import updateTpopkontrzaehlByIdGql from './updateTpopkontrzaehlById'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'

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

const Tpopkontrzaehl = ({ treeName }) => {
  const store = useContext(storeContext)
  const { refetch } = store
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

  const codes = get(dataZaehlOfEk, 'allTpopkontrzaehls.nodes', []).map(
    n => n.einheit,
  )
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
      try {
        await client.mutate({
          mutation: updateTpopkontrzaehlByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTpopkontrzaehlById: {
              tpopkontrzaehl: {
                ...values,
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
      if (['einheit', 'methode'].includes(changedField)) {
        refetch.tpopkontrzaehls()
      }
    },
    [row],
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
                <Field
                  name="einheit"
                  label="Einheit"
                  options={get(
                    dataLists,
                    'allTpopkontrzaehlEinheitWertes.nodes',
                    [],
                  )}
                  loading={loadingLists}
                  component={Select}
                />
                <Field
                  name="anzahl"
                  label="Anzahl (nur ganze Zahlen)"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="methode"
                  label="Methode"
                  dataSource={get(
                    dataLists,
                    'allTpopkontrzaehlMethodeWertes.nodes',
                    [],
                  )}
                  component={RadioButtonGroup}
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
