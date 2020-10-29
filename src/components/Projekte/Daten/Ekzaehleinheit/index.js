import React, { useCallback, useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import Checkbox2States from '../../../shared/Checkbox2StatesFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

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
  bemerkungen: 'String',
  apId: 'UUID',
  zaehleinheitId: 'UUID',
  zielrelevant: 'Boolean',
  sort: 'Int',
}

const Ekzaehleinheit = ({ treeName }) => {
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

  const row = get(data, 'ekzaehleinheitById', {})

  const ekzaehleinheitenOfAp = get(
    row,
    'apByApId.ekzaehleinheitsByApId.nodes',
    [],
  ).map((o) => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter((o) => o !== row.zaehleinheitId)
  const zaehleinheitWerteFilter = notToShow.length
    ? { id: { notIn: notToShow } }
    : { id: { isNull: false } }
  const {
    data: dataLists,
    loading: loadingLists,
    error: errorLists,
  } = useQuery(queryLists, {
    variables: {
      filter: zaehleinheitWerteFilter,
    },
  })

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
            mutation updateEkzaehleinheit(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateEkzaehleinheitById(
                input: {
                  id: $id
                  ekzaehleinheitPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                ekzaehleinheit {
                  ...EkzaehleinheitFields
                  tpopkontrzaehlEinheitWerteByZaehleinheitId {
                    ...TpopkontrzaehlEinheitWerteFields
                  }
                }
              }
            }
            ${ekzaehleinheit}
            ${tpopkontrzaehlEinheitWerte}
          `,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkzaehleinheitById: {
              ekzaehleinheit: {
                ...variables,
                __typename: 'Ekzaehleinheit',
              },
              __typename: 'Ekzaehleinheit',
            },
          },
        })
      } catch (error) {
        if (
          changedField === 'zielrelevant' &&
          (error.message.includes('doppelter Schlüsselwert') ||
            error.message.includes('duplicate key value'))
        ) {
          return setErrors({
            [changedField]:
              'Pro Aktionsplan darf nur eine Einheit zielrelevant sein',
          })
        }
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
  if (error) {
    return (
      <LoadingContainer>
        {`Fehler beim Laden der Daten: ${error.message}`}
      </LoadingContainer>
    )
  }
  if (errorLists) {
    return (
      <LoadingContainer>{`Fehler: ${errorLists.message}`}</LoadingContainer>
    )
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EK-Zähleinheit"
          treeName={treeName}
          table="ekzaehleinheit"
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
                    name="zaehleinheitId"
                    label="Zähleinheit"
                    options={get(
                      dataLists,
                      'allTpopkontrzaehlEinheitWertes.nodes',
                      [],
                    )}
                    loading={loadingLists}
                    handleSubmit={handleSubmit}
                  />
                  <Checkbox2States
                    name="zielrelevant"
                    label="zielrelevant"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="sort"
                    label="Sortierung"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  <TextField
                    name="bemerkungen"
                    label="Bemerkungen"
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

export default observer(Ekzaehleinheit)
