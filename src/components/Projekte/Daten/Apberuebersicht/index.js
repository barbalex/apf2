import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import Button from '@mui/material/Button'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { Formik, Form } from 'formik'
import jwtDecode from 'jwt-decode'
import format from 'date-fns/format'
import { DateTime } from 'luxon'
import SimpleBar from 'simplebar-react'

import TextField from '../../../shared/TextFieldFormik'
import MdField from '../../../shared/MarkdownFieldFormik'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import objectsFindChangedKey from '../../../../modules/objectsFindChangedKey'
import objectsEmptyValuesToNull from '../../../../modules/objectsEmptyValuesToNull'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apberuebersicht } from '../../../shared/fragments'
import Error from '../../../shared/Error'

const Container = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  display: flex;
  flex-direction: column;
`
const LoadingContainer = styled.div`
  height: ${(props) => `calc(100vh - ${props['data-appbar-height']}px)`};
  padding: 10px;
`
const FieldsContainer = styled.div`
  height: ${(props) => `calc(100% - ${props['data-form-title-height']}px)`};
`
const StyledForm = styled(Form)`
  padding: 10px;
`
const StyledButton = styled(Button)`
  text-transform: none !important;
  border-color: rgba(46, 125, 50, 0.3) !important;
  margin-bottom: 15px !important;
  &:hover {
    background-color: rgba(46, 125, 50, 0.1) !important;
  }
`

const fieldTypes = {
  projId: 'UUID',
  jahr: 'Int',
  historyDate: 'Date',
  bemerkungen: 'String',
}

const Apberuebersicht = ({ treeName }) => {
  const store = useContext(storeContext)
  const client = useApolloClient()
  const { user, enqueNotification, appBarHeight } = store
  const { token } = user
  const role = token ? jwtDecode(token).role : null
  const userIsManager = role === 'apflora_manager'
  const { activeNodeArray } = store[treeName]

  const { data, loading, error, refetch } = useQuery(query, {
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
      console.log('Apberuebersicht, onSubmit', { values, row })
      const changedField = objectsFindChangedKey(values, row)
      // BEWARE: react-select fires twice when a value is cleared
      // second event leads to an error as the values passed are same as before
      // so prevent this by returning if no changed field exists
      // https://github.com/JedWatson/react-select/issues/4101
      if (!changedField) return

      const variables = {
        ...objectsEmptyValuesToNull(values),
        changedBy: store.user.name,
      }
      console.log('Apberuebersicht, onSubmit', { changedField })
      try {
        await client.mutate({
          mutation: gql`
            mutation updateApberuebersicht(
              $id: UUID!
              $${changedField}: ${fieldTypes[changedField]}
              $changedBy: String
            ) {
              updateApberuebersichtById(
                input: {
                  id: $id
                  apberuebersichtPatch: {
                    ${changedField}: $${changedField}
                    changedBy: $changedBy
                  }
                }
              ) {
                apberuebersicht {
                  ...ApberuebersichtFields
                }
              }
            }
            ${apberuebersicht}
          `,
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

  const isBeforeMarchOfFollowingYear = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousYear = currentYear - 1
    return (
      (currentMonth < 3 && previousYear === row.jahr) ||
      currentYear === row.jahr
    )
  }, [row.jahr])
  const showHistorize = userIsManager && isBeforeMarchOfFollowingYear

  const onClickHistorize = useCallback(async () => {
    // 1. historize
    try {
      await client.mutate({
        mutation: gql`
          mutation historize($year: Int!) {
            historize(input: { clientMutationId: "bla", year: $year }) {
              boolean
            }
          }
        `,
        variables: {
          year: row.jahr,
        },
      })
    } catch (error) {
      console.log('Error from mutating historize:', error)
      return enqueNotification({
        message: `Die Historisierung ist gescheitert. Fehlermeldung: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
    // 2. if it worked: mutate historyDate
    try {
      const variables = {
        id: row.id,
        historyDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      }
      await client.mutate({
        mutation: gql`
          mutation updateApberuebersichtForHistoryDate(
            $id: UUID!
            $historyDate: Date
          ) {
            updateApberuebersichtById(
              input: {
                id: $id
                apberuebersichtPatch: { historyDate: $historyDate }
              }
            ) {
              apberuebersicht {
                ...ApberuebersichtFields
              }
            }
          }
          ${apberuebersicht}
        `,
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
      return enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    // 3. update materialized view
    await client.mutate({
      mutation: gql`
        mutation vApAuswPopMengeRefreshFromApberuebersicht {
          vApAuswPopMengeRefresh(input: { clientMutationId: "bla" }) {
            boolean
          }
        }
      `,
    })
    // notify user
    enqueNotification({
      message: `AP, Pop und TPop wurden für das Jahr ${row.jahr} historisiert`,
      options: {
        variant: 'info',
      },
    })
    refetch()
  }, [client, enqueNotification, refetch, row])

  const [formTitleHeight, setFormTitleHeight] = useState(43)

  if (loading) {
    return (
      <LoadingContainer data-appbar-height={appBarHeight}>
        Lade...
      </LoadingContainer>
    )
  }
  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container data-appbar-height={appBarHeight}>
        <FormTitle
          title="AP-Bericht Jahresübersicht"
          treeName={treeName}
          table="apberuebersicht"
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
                  <TextField
                    name="jahr"
                    label="Jahr"
                    type="number"
                    handleSubmit={handleSubmit}
                  />
                  {!!row.historyDate && (
                    <TextFieldNonUpdatable
                      value={format(new Date(row.historyDate), 'dd.MM.yyyy')}
                      label="Datum, an dem AP, Pop und TPop historisiert wurden"
                    />
                  )}
                  {showHistorize && (
                    <StyledButton
                      variant="outlined"
                      onClick={onClickHistorize}
                      title="Diese Option ist nur sichtbar: 1. Wenn Benutzer Manager ist 2. bis zum März des Folgejahrs"
                      color="inherit"
                    >
                      {`AP, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können`}
                    </StyledButton>
                  )}
                  <MdField name="bemerkungen" label="Bemerkungen" />
                </StyledForm>
              )}
            </Formik>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Apberuebersicht)
