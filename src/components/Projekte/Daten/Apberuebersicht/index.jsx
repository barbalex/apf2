import { memo, useCallback, useContext, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { jwtDecode } from 'jwt-decode'
import { format } from 'date-fns/format'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { TextField } from '../../../shared/TextField.jsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.jsx'
import { TextFieldNonUpdatable } from '../../../shared/TextFieldNonUpdatable.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'
import { query } from './query.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { apberuebersicht } from '../../../shared/fragments.js'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.jsx'
import { historize } from '../../../../modules/historize.js'
import { Menu } from './Menu.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const FieldsContainer = styled.div`
  overflow-y: auto;
  scrollbar-width: thin;
  flex-grow: 1;
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

export const Component = memo(
  observer(() => {
    const { apberuebersichtId } = useParams()

    const store = useContext(MobxContext)
    const client = useApolloClient()
    const { user } = store
    const { token } = user
    const role = token ? jwtDecode(token).role : null
    const userIsManager = role === 'apflora_manager'

    const queryClient = useQueryClient()

    const [fieldErrors, setFieldErrors] = useState({})
    const [historizing, setHistorizing] = useState(false)

    const { data, isLoading, error } = useQuery({
      queryKey: [`Apberuebersicht`, apberuebersichtId],
      queryFn: () =>
        client.query({
          query,
          variables: { id: apberuebersichtId },
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
        }
        queryClient.invalidateQueries({
          queryKey: [`Apberuebersicht`],
        })
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
      if (!row?.jahr)
        return console.log('Apberuebersicht, onClickHistorize: year missing')
      setHistorizing(true)
      await historize({ store, apberuebersicht: row })
      queryClient.invalidateQueries({
        queryKey: ['Apberuebersicht'],
      })
      setHistorizing(false)
    }, [queryClient, row, store])

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    if (!row) return null

    return (
      <ErrorBoundary>
        <Container>
          <FormTitle
            title="AP-Bericht Jahresübersicht"
            MenuBarComponent={Menu}
          />
          <FieldsContainer>
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
                    disabled={historizing || row?.historyFixed}
                  >
                    <span>{`Arten, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können`}</span>
                    <Explainer>
                      {historizing ?
                        'Bitte warten, das dauert eine Weile...'
                      : <>
                          Diese Option ist nur sichtbar:
                          <br /> 1. Wenn der Benutzer Manager ist
                          <br /> 2. Von Beginn des Berichtjahrs bis zum März des
                          Folgejahrs
                        </>
                      }
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
              <MarkdownField
                name="bemerkungen"
                label="Bemerkungen"
                value={row.bemerkungen}
                saveToDb={saveToDb}
                error={fieldErrors.bemerkungen}
              />
            </FormContainer>
          </FieldsContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
