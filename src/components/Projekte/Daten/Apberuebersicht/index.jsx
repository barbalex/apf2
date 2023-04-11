import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import jwtDecode from 'jwt-decode'
import format from 'date-fns/format'
import { DateTime } from 'luxon'
import SimpleBar from 'simplebar-react'
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import TextField from '../../../shared/TextField'
import MdField from '../../../shared/MarkdownField'
import TextFieldNonUpdatable from '../../../shared/TextFieldNonUpdatable'
import FormTitle from '../../../shared/FormTitle'
import query from './query'
import storeContext from '../../../../storeContext'
import ifIsNumericAsNumber from '../../../../modules/ifIsNumericAsNumber'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { apberuebersicht } from '../../../shared/fragments'
import Error from '../../../shared/Error'
import Spinner from '../../../shared/Spinner'
import Checkbox2States from '../../../shared/Checkbox2States'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
`
const HistorizeButton = styled(Button)`
  text-transform: none !important;
  border-color: rgba(46, 125, 50, 0.3) !important;
  margin-bottom: 15px !important;
  display: block;
  ${(props) =>
    props['data-historizing'] && 'animation: blinker 1s linear infinite;'}
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
  &:hover {
    background-color: rgba(46, 125, 50, 0.1) !important;
  }
`
const Explainer = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.7rem;
  font-weight: normal;
  line-height: 0.9rem;
`
const FormContainer = styled.div`
  padding: 10px;
`

const fieldTypes = {
  projId: 'UUID',
  jahr: 'Int',
  historyDate: 'Date',
  historyFixed: 'Boolean',
  bemerkungen: 'String',
}

const Apberuebersicht = () => {
  const { apberUebersichtId } = useParams()

  const store = useContext(storeContext)
  const client = useApolloClient()
  const { user, enqueNotification } = store
  const { token } = user
  const role = token ? jwtDecode(token).role : null
  const userIsManager = role === 'apflora_manager'

  const queryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState({})
  const [historizing, setHistorizing] = useState(false)

  console.log('Apberuebersicht, historizing:', historizing)

  const { data, isLoading, error } = useQuery({
    queryKey: [`Apberuebersicht`, apberUebersichtId],
    queryFn: () =>
      client.query({
        query,
        variables: { id: apberUebersichtId },
        fetchPolicy: 'no-cache',
      }),
  })

  const row = data?.data?.apberuebersichtById

  const saveToDb = useCallback(
    async (event) => {
      const field = event.target.name
      const value = ifIsNumericAsNumber(event.target.value)

      const variables = {
        id: row?.id,
        [field]: value,
        changedBy: store.user.name,
      }
      try {
        await client.mutate({
          mutation: gql`
            mutation updateApberuebersicht(
              $id: UUID!
              $${field}: ${fieldTypes[field]}
              $changedBy: String
            ) {
              updateApberuebersichtById(
                input: {
                  id: $id
                  apberuebersichtPatch: {
                    ${field}: $${field}
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
        })
      } catch (error) {
        return setFieldErrors({ [field]: error.message })
      }
      setFieldErrors({})
      if (field === 'jahr') {
        queryClient.invalidateQueries({
          queryKey: [`treeApberuebersicht`],
        })
        queryClient.invalidateQueries({
          queryKey: [`Apberuebersicht`],
        })
      }
    },
    [client, queryClient, row?.id, store.user.name],
  )

  const isBeforeMarchOfFollowingYear = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousYear = currentYear - 1
    return (
      (currentMonth < 3 && previousYear === row?.jahr) ||
      currentYear === row?.jahr
    )
  }, [row?.jahr])
  const showHistorize = userIsManager && isBeforeMarchOfFollowingYear
  // console.log('Apberuebersicht', {
  //   showHistorize,
  //   isBeforeMarchOfFollowingYear,
  //   userIsManager,
  //   row,
  //   jahr: row?.jahr,
  // })

  const onClickHistorize = useCallback(async () => {
    setHistorizing(true)
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
          year: row?.jahr,
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
        id: row?.id,
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
          vPopAuswTpopMengeRefresh(input: { clientMutationId: "bla" }) {
            boolean
          }
        }
      `,
    })
    // notify user
    enqueNotification({
      message: `Arten, Pop und TPop wurden für das Jahr ${row?.jahr} historisiert`,
      options: {
        variant: 'info',
      },
    })
    queryClient.invalidateQueries({
      queryKey: ['Apberuebersicht'],
    })
    setHistorizing(false)
  }, [client, enqueNotification, row?.id, row?.jahr, queryClient])

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="AP-Bericht Jahresübersicht" />
        <FieldsContainer>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
          >
            <FormContainer>
              <TextField
                name="jahr"
                label="Jahr"
                type="number"
                value={row.jahr}
                saveToDb={saveToDb}
                error={fieldErrors.jahr}
              />
              {!!row.historyDate && (
                <TextFieldNonUpdatable
                  value={format(new Date(row.historyDate), 'dd.MM.yyyy')}
                  label="Datum, an dem Arten, Pop und TPop historisiert wurden"
                />
              )}
              {showHistorize && (
                <>
                  <HistorizeButton
                    variant="outlined"
                    onClick={onClickHistorize}
                    title="historisieren"
                    color="inherit"
                    data-historizing={historizing}
                    disabled={historizing}
                  >
                    <span>{`Arten, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können`}</span>
                    <Explainer>
                      {historizing ? (
                        'Bitte warten, das dauert eine Weile...'
                      ) : (
                        <>
                          Diese Option ist nur sichtbar:
                          <br /> 1. Wenn der Benutzer Manager ist
                          <br /> 2. Von Beginn des Berichtjahrs bis zum März des
                          Folgejahrs
                        </>
                      )}
                    </Explainer>
                  </HistorizeButton>
                </>
              )}
              <Checkbox2States
                label="Historisierung fixieren"
                name="historyFixed"
                value={row?.historyFixed}
                saveToDb={saveToDb}
                helperText="Bewahrt die letze Historisierung als offiziellen Jahresbericht"
                disabled={!row?.historyDate}
              />
              <MdField
                name="bemerkungen"
                label="Bemerkungen"
                value={row.bemerkungen}
                saveToDb={saveToDb}
                error={fieldErrors.bemerkungen}
              />
            </FormContainer>
          </SimpleBar>
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export const Component = observer(Apberuebersicht)
