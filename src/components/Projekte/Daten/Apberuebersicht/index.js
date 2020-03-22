import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Formik, Form, Field } from 'formik'
import ErrorBoundary from 'react-error-boundary'
import jwtDecode from 'jwt-decode'

import TextField from '../../../shared/TextFieldFormik'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import updateApberuebersichtByIdGql from './updateApberuebersichtById'
import query from './query'
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
  height: 100%;
  padding: 10px;
  height: 100%;
`
const StyledButton = styled(Button)`
  text-transform: none !important;
  border-color: rgba(46, 125, 50, 0.3) !important;
  margin-bottom: 15px !important;
  &:hover {
    background-color: rgba(46, 125, 50, 0.1) !important;
  }
`

const Apberuebersicht = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { user } = store
  const { token } = user
  const role = token ? jwtDecode(token).role : null
  const isManager = role === 'apflora_manager'
  const { activeNodeArray } = store[treeName]

  const { data, loading, error } = useQuery(query, {
    variables: {
      id:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const row = get(data, 'apberuebersichtById', {})

  const onSubmit = useCallback(
    async (values, { setErrors }) => {
      const changedField = objectsFindChangedKey(values, row)
      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: updateApberuebersichtByIdGql,
          variables,
          optimisticResponse: {
            __typename: 'Mutation',
            updateApberuebersichtById: {
              apberuebersicht: {
                ...variables,
                __typename: 'Apberuebersicht',
              },
              __typename: 'Apberuebersicht',
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

  const isJanuaryThroughMarch = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    return currentMonth < 3
  }, [])
  const notHistorizedYet = !row.historyDate
  const showHistorize = isManager && isJanuaryThroughMarch && notHistorizedYet

  const onClickHistorize = useCallback(() => {
    const now = new Date()
    const year = now.getFullYear() - 1
    // 1. mutate historyDate
    //client.mutate({mutation: historize, variables: {year }})
  }, [])

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
      <Container>
        <FormTitle
          title="AP-Bericht Jahresübersicht"
          treeName={treeName}
          table="apberuebersicht"
        />
        <FieldsContainer>
          <Formik initialValues={row} onSubmit={onSubmit} enableReinitialize>
            {({ handleSubmit, dirty }) => (
              <Form onBlur={() => dirty && handleSubmit()}>
                <Field
                  name="jahr"
                  label="Jahr"
                  type="number"
                  component={TextField}
                />
                {!!row.historyDate && (
                  <TextFieldNonUpdatable
                    name="historyDate"
                    label="Datum, an dem AP, Pop und TPop historisiert wurden"
                    component={TextField}
                  />
                )}{' '}
                {showHistorize && (
                  <StyledButton
                    variant="outlined"
                    onClick={onClickHistorize}
                    title="Diese Option ist nur sichtbar: 1. Wenn Benutzer Manager ist 2. Noch nicht historisiert wurde und 3. zwischen Januar und März"
                  >
                    {`AP, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können`}
                  </StyledButton>
                )}
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

export default observer(Apberuebersicht)
