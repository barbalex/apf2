import { useState, Suspense, type ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { jwtDecode } from 'jwt-decode'
import { format } from 'date-fns/format'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { TextField } from '../../../shared/TextField.tsx'
import { MarkdownField } from '../../../shared/MarkdownField/index.tsx'
import { TextFieldNonUpdatable } from '../../../shared/TextFieldNonUpdatable.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'
import { query } from './query.ts'
import { userAtom } from '../../../../store/index.ts'
import { ifIsNumericAsNumber } from '../../../../modules/ifIsNumericAsNumber.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { apberuebersicht } from '../../../shared/fragments.ts'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'
import { Checkbox2States } from '../../../shared/Checkbox2States.tsx'
import { historize } from '../../../../modules/historize.ts'
import { Menu } from './Menu.tsx'

import type Apberuebersicht from '../../../../models/apflora/Apberuebersicht.ts'

import styles from './index.module.css'

const fieldTypes = {
  projId: 'UUID',
  jahr: 'Int',
  historyDate: 'Date',
  historyFixed: 'Boolean',
  bemerkungen: 'String',
}

interface ApberuebersichtQueryResult {
  data?: {
    apberuebersichtById: Apberuebersicht
  }
}

const getIsBeforeMarchOfFollowingYear = (jahr: number | null | undefined) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const previousYear = currentYear - 1
  return (currentMonth < 3 && previousYear === jahr) || currentYear === jahr
}

export const Component = () => {
  const { apberuebersichtId } = useParams<{ apberuebersichtId: string }>()

  const user = useAtomValue(userAtom)
  const { token } = user
  const role = token ? jwtDecode(token).role : null
  const userIsManager = role === 'apflora_manager'

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [historizing, setHistorizing] = useState(false)

  const { data, error } = useQuery<ApberuebersichtQueryResult>({
    queryKey: [`Apberuebersicht`, apberuebersichtId],
    queryFn: () =>
      apolloClient.query({
        query,
        variables: { id: apberuebersichtId },
      }),
  })

  const row = data?.data?.apberuebersichtById

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name
    const value = ifIsNumericAsNumber(event.target.value)

    const variables = {
      id: row?.id,
      [field]: value,
      changedBy: user.name,
    }
    try {
      await apolloClient.mutate({
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
      return setFieldErrors((prev) => ({
        ...prev,
        [field]: (error as Error).message,
      }))
    }
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev
      return rest
    })
    if (field === 'jahr') {
      tsQueryClient.invalidateQueries({
        queryKey: [`treeApberuebersicht`],
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`Apberuebersicht`],
    })
  }

  const isBeforeMarchOfFollowingYear = getIsBeforeMarchOfFollowingYear(
    row?.jahr,
  )
  const showHistorize = userIsManager && isBeforeMarchOfFollowingYear

  const onClickHistorize = async () => {
    if (!row?.jahr)
      return console.log('Apberuebersicht, onClickHistorize: year missing')
    setHistorizing(true)
    await historize({ apberuebersicht: row })
    tsQueryClient.invalidateQueries({
      queryKey: ['Apberuebersicht'],
    })
    setHistorizing(false)
  }

  const historizeButtonStyle =
    historizing ? { animation: 'blinker 1s linear infinite' } : {}

  if (error) return <Error error={error} />

  if (!row) return null

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FormTitle
          title="AP-Bericht Jahresübersicht"
          MenuBarComponent={Menu}
        />
        <Suspense fallback={<Spinner />}>
          <div className={styles.fieldsContainer}>
            <div className={styles.formContainer}>
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
                  <Button
                    variant="outlined"
                    onClick={onClickHistorize}
                    title="historisieren"
                    color="inherit"
                    disabled={historizing || row?.historyFixed}
                    style={historizeButtonStyle}
                    className={styles.historizeButton}
                  >
                    <span>{`Arten, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können`}</span>
                    <div className={styles.explainer}>
                      {historizing ?
                        'Bitte warten, das dauert eine Weile...'
                      : <>
                          Diese Option ist nur sichtbar:
                          <br /> 1. Wenn der Benutzer Manager ist
                          <br /> 2. Von Beginn des Berichtjahrs bis zum März des
                          Folgejahrs
                        </>
                      }
                    </div>
                  </Button>
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
            </div>
          </div>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
