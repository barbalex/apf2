import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { gql } from '@apollo/client'
import SimpleBar from 'simplebar-react'

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
import Error from '../../../shared/Error'
import { tpopkontrzaehl } from '../../../shared/fragments'

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
const StyledForm = styled(Form)`
  padding: 10px;
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

  const [formTitleHeight, setFormTitleHeight] = useState(0)

  if (loading) {
    return <LoadingContainer>Lade...</LoadingContainer>
  }

  const errors = [
    ...(error ? [error] : []),
    ...(errorLists ? [errorLists] : []),
    ...(errorZaehlOfEk ? [errorZaehlOfEk] : []),
  ]
  if (errors.length) return <Error errors={errors} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={activeNodeArray[3]}
          title="Zählung"
          treeName={treeName}
          table="tpopkontrzaehl"
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
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Tpopkontrzaehl)
