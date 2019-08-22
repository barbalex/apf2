import React, { useCallback, useContext } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'

import TextField from '../../../shared/TextFieldFormik'
import Select from '../../../shared/SelectFormik'
import RadioButton from '../../../shared/RadioButtonFormik'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import queryLists from './queryLists'
import updateEkzaehleinheitByIdGql from './updateEkzaehleinheitById'
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

const Ekzaehleinheit = ({ treeName }) => {
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

  const row = get(data, 'ekzaehleinheitById', {})

  const ekzaehleinheitenOfAp = get(
    row,
    'apByApId.ekzaehleinheitsByApId.nodes',
    [],
  ).map(o => o.zaehleinheitId)
  // re-add this ones id
  const notToShow = ekzaehleinheitenOfAp.filter(o => o !== row.zaehleinheitId)
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
      try {
        await client.mutate({
          mutation: updateEkzaehleinheitByIdGql,
          variables: {
            ...objectsEmptyValuesToNull(values),
            changedBy: store.user.name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateEkzaehleinheitById: {
              ekzaehleinheit: {
                ...values,
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
      if (changedField === 'zaehleinheitId') refetch.ekzaehleinheits()
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
  if (errorLists) {
    return `Fehler: ${errorLists.message}`
  }
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle
          apId={row.apId}
          title="EK-Zähleinheit"
          treeName={treeName}
          table="ekzaehleinheit"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="zaehleinheitId"
                  label="Zähleinheit"
                  options={get(
                    dataLists,
                    'allTpopkontrzaehlEinheitWertes.nodes',
                    [],
                  )}
                  loading={loadingLists}
                  component={Select}
                />
                <Field
                  name="zielrelevant"
                  label="zielrelevant"
                  component={RadioButton}
                />
                <Field
                  name="sort"
                  label="Sortierung"
                  type="number"
                  component={TextField}
                />
                <Field
                  name="bemerkungen"
                  label="Bemerkungen"
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

export default observer(Ekzaehleinheit)
