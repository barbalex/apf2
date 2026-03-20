import { useState, type ChangeEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Paper from '@mui/material/Paper'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { FaExternalLinkAlt } from 'react-icons/fa'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams, useLocation, Form } from 'react-router'

import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { standardQkYear } from '../../../../../modules/standardQkYear.ts'
import { query } from './query.ts'
import { createMessageFunctions } from './createMessageFunctions.ts'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.tsx'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.ts'
import { openTree2WithActiveNodeArray } from '../../../../../modules/openTree2WithActiveNodeArray.ts'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'

import type { QkName } from '../../../../../models/apflora/index.tsx'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
}

interface QkProps {
  qkNameQueries: Record<string, boolean>
  qks: QkNode[]
}

interface QkNode {
  name: QkName
  titel: string | null
}

interface QkProps {
  qkNameQueries: Record<string, boolean>
  qks: QkNode[]
}

// QK query returns a very large, dynamic structure with many optional fields
// Using Record for flexibility since the structure varies based on which QK checks are enabled
interface QkQueryResult {
  [key: string]: any
}

export const Qk = ({ qkNameQueries, qks }: QkProps) => {
  const { apId, projId } = useParams()
  const { search } = useLocation()

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()

  const [berichtjahr, setBerichtjahr] = useState(standardQkYear())
  const [filter, setFilter] = useState('')

  const apolloClient = useApolloClient()
  const { data, refetch, isFetching } = useQuery<QkQueryResult>({
    queryKey: ['qk', apId, projId, berichtjahr, qkNameQueries],
    queryFn: async () => {
      const result = await apolloClient.query<QkQueryResult>({
        query,
        variables: {
          ...qkNameQueries,
          berichtjahr,
          notIsBerichtjahr: !berichtjahr,
          apId,
          projId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    // no suspense as loading state is managed via isFetching
  })

  const onChangeBerichtjahr = (event: ChangeEvent<HTMLInputElement>) =>
    setBerichtjahr(+event.target.value)
  const onChangeFilter = (event: ChangeEvent<HTMLInputElement>) =>
    setFilter(event.target.value)

  const messageFunctions = createMessageFunctions({
    data,
    projId,
    apId,
  })
  const messageGroups = qks
    .filter((qk) => !!messageFunctions[qk.name])
    .map((qk) => ({
      title: qk.titel,
      messages: messageFunctions[qk.name](),
    }))
    .filter((q) => q.messages.length)

  const messageGroupsFiltered = messageGroups.filter((messageGroup) => {
    if (!!filter && messageGroup.title && messageGroup.title.toLowerCase) {
      return messageGroup.title.toLowerCase().includes(filter.toLowerCase())
    }
    return true
  })

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
            onClick={refetch}
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
                onClick={() => refetch()}
                variant="outlined"
                className={styles.analyzingButton}
              >
                neu analysieren
              </Button>
            </Badge>
          </div>
        }
        {isFetching ?
          null
        : messageGroups.length > 0 ?
          <div className={styles.scrollContainer}>
            {messageGroupsFiltered.map((messageGroup) => (
              <Paper
                key={messageGroup.title}
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
                          activeNodeArray: m.url,
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
        : <div>Juhui. Offenbar gibt es nichts zu meckern!</div>}
      </div>
    </ErrorBoundary>
  )
}
