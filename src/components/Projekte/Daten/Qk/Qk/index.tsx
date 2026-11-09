import { fetchQkData } from './fetchQkData.ts'
import { useState, type ChangeEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import { useQuery } from '@tanstack/react-query'
import { FaExternalLinkAlt } from 'react-icons/fa'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams, useLocation } from 'react-router'

import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { standardQkYear } from '../../../../../modules/standardQkYear.ts'
import { createMessageFunctions } from './createMessageFunctions.ts'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { openTree2WithActiveNodeArray } from '../../../../../modules/openTree2WithActiveNodeArray.ts'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'

import type { QkName } from '../../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
}

interface QkProps {
  qkNameQueries: Record<string, boolean>
  qks: QkNode[]
}

export const Qk = ({ qkNameQueries, qks }: QkProps) => {
  const { apId, projId } = useParams()
  const { search } = useLocation()

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()

  const [berichtjahr, setBerichtjahr] = useState(standardQkYear())
  const [filter, setFilter] = useState('')

  const now = new Date()
  const minDatum = new Date(
    now.getFullYear() - 100,
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split('T')[0]
  const maxDatum = new Date(
    now.getFullYear() + 100,
    now.getMonth(),
    now.getDate(),
  )
    .toISOString()
    .split('T')[0]
  const { data, refetch, isFetching, error } = useQuery({
    queryKey: ['qk', apId, projId, berichtjahr, qkNameQueries],
    queryFn: async () => {
      // phase 5: only the active checks are fetched (former @include doc)
      return await fetchQkData({
        projId: projId ?? '',
        apId: apId ?? '',
        berichtjahr,
        activeChecks: qkNameQueries,
        minDatum: minDatum ?? '',
        maxDatum: maxDatum ?? '',
      })
    },
    // no suspense as loading state is managed via isFetching
  })

  const onChangeBerichtjahr = (event: ChangeEvent<HTMLInputElement>) =>
    setBerichtjahr(+event.target.value)
  const onChangeFilter = (event: ChangeEvent<HTMLInputElement>) =>
    setFilter(event.target.value)

  // checks that failed individually — their results are missing, the
  // other checks' results still show (#836)
  const failedChecks = data?.errors ?? []

  const messageFunctions = createMessageFunctions({
    data: data?.data,
    projId,
    apId,
  })
  const messageGroups = qks
    .filter((qk) => !!messageFunctions[qk.name])
    .map((qk) => ({
      // name is the primary key of apflora.qk; titel is not unique
      name: qk.name,
      title: qk.titel,
      messages: messageFunctions[qk.name]?.() ?? [],
    }))
    .filter((q) => q.messages.length)

  const messageGroupsFiltered = messageGroups.filter((messageGroup) => {
    if (!!filter && messageGroup.title && messageGroup.title.toLowerCase) {
      return messageGroup.title.toLowerCase().includes(filter.toLowerCase())
    }
    return true
  })

  // a failed run must never read as "nothing to complain about" (#836)
  const runError = error as Error | null

  return (
    <ErrorBoundary>
      <FormTitle title="Qualitätskontrollen ausführen" />
      <div className={styles.container}>
        <FormControl
          fullWidth
          variant="standard"
          className={styles.berichtjahrControl}
        >
          <InputLabel htmlFor="berichtjahr">Berichtjahr</InputLabel>
          <Input
            id="berichtjahr"
            value={berichtjahr}
            type="number"
            onChange={onChangeBerichtjahr}
          />
        </FormControl>
        <FormControl
          fullWidth
          variant="standard"
          className={styles.styledFormControl}
        >
          <InputLabel htmlFor="filter">
            nach Abschnitts-Titel filtern
          </InputLabel>
          <Input
            id="filter"
            value={filter}
            onChange={onChangeFilter}
          />
        </FormControl>
        {isFetching ?
          <Button
            onClick={() => void refetch()}
            variant="outlined"
            className={styles.analyzingButton}
          >
            <span className={styles.analyzingSpan}>
              Die Daten werden analysiert
            </span>
            <CircularProgress />
          </Button>
        : <div>
            <Badge
              badgeContent={messageGroupsFiltered.length}
              color="primary"
            >
              <Button
                onClick={() => void refetch()}
                variant="outlined"
                className={styles.analyzingButton}
              >
                neu analysieren
              </Button>
            </Badge>
          </div>
        }
        {runError ?
          <Alert
            severity="error"
            className={styles.styledFormControl}
          >{`Die Qualitätskontrollen konnten nicht geladen werden: ${runError.message}. Bitte melden Sie diesen Fehler.`}</Alert>
        : isFetching ?
          null
        : <>
            {failedChecks.map((failedCheck) => (
              <Alert
                key={failedCheck.checkName}
                severity="error"
                className={styles.styledFormControl}
              >{`Eine Prüfung konnte nicht geladen werden (Prüfung: ${
                  qks.find((qk) => qk.name === failedCheck.checkName)
                    ?.titel ?? failedCheck.checkName
                }): ${failedCheck.message}. Bitte melden Sie diesen Fehler.`}</Alert>
            ))}
            {messageGroups.length > 0 ?
              <div className={styles.scrollContainer}>
                {messageGroupsFiltered.map((messageGroup) => (
                  <Paper
                    key={messageGroup.name}
                    elevation={2}
                    className={styles.styledPaper}
                  >
                    <div className={styles.title}>{messageGroup.title}</div>
                    {messageGroup.messages.map((m, i) => (
                      <div
                        className={styles.row}
                        key={`${m.text}Index${i}`}
                      >
                        <p
                          className={styles.styledA}
                          onClick={() =>
                            openTree2WithActiveNodeArray({
                              // message urls are built from existing db rows
                              activeNodeArray: m.url as (string | number)[],
                              search,
                              projekteTabs,
                              setProjekteTabs,
                              onlyShowActivePath: true,
                            })
                          }
                          title="in Navigationsbaum 2 öffnen"
                        >
                          {m.text}
                        </p>
                        <div
                          className={styles.outsideLink}
                          onClick={() => {
                            const url = `${appBaseUrl()}Daten/${m.url.join(
                              '/',
                            )}?onlyShowActivePath=true`
                            if (
                              window.matchMedia('(display-mode: standalone)')
                                .matches
                            ) {
                              return window.open(url, '_blank', 'toolbar=no')
                            }
                            window.open(url)
                          }}
                          title="in neuem Fenster öffnen"
                        >
                          <FaExternalLinkAlt />
                        </div>
                      </div>
                    ))}
                  </Paper>
                ))}
              </div>
            : failedChecks.length === 0 &&
              <div>Juhui. Offenbar gibt es nichts zu meckern!</div>}
          </>
        }
      </div>
    </ErrorBoundary>
  )
}
