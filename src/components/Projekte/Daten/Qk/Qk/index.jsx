import { useState, useContext } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import Paper from '@mui/material/Paper'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client/react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams, useLocation, Form } from 'react-router'

import { appBaseUrl } from '../../../../../modules/appBaseUrl.js'
import { standardQkYear } from '../../../../../modules/standardQkYear.js'
import { query } from './query.js'
import { createMessageFunctions } from './createMessageFunctions.js'
import { MobxContext } from '../../../../../mobxContext.js'
import { ErrorBoundary } from '../../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../../shared/Error.jsx'
import { useProjekteTabs } from '../../../../../modules/useProjekteTabs.js'
import { FormTitle } from '../../../../shared/FormTitle/index.jsx'

import {
  container,
  scrollContainer,
  styledPaper,
  title,
  styledA,
  row,
  outsideLink,
  styledFormControl,
  berichtjahrControl,
  analyzingButton,
  analyzingSpan,
} from './index.module.css'

export const Qk = observer(({ qkNameQueries, qks }) => {
  const { apId, projId } = useParams()
  const { search } = useLocation()

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()

  const store = useContext(MobxContext)
  const { openTree2WithActiveNodeArray } = store

  const [berichtjahr, setBerichtjahr] = useState(standardQkYear())
  const [filter, setFilter] = useState('')

  const { data, error, loading, refetch } = useQuery(query, {
    // want to explicitly show user re-loading
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      ...qkNameQueries,
      berichtjahr,
      notIsBerichtjahr: !berichtjahr,
      apId,
      projId,
    },
  })

  const onChangeBerichtjahr = (event) => setBerichtjahr(+event.target.value)
  const onChangeFilter = (event) => setFilter(event.target.value)

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

  if (error) return <Error error={error} />
  return (
    <ErrorBoundary>
      <FormTitle title="Qualitätskontrollen ausführen" />
      <div className={container}>
        <FormControl
          fullWidth
          variant="standard"
          className={berichtjahrControl}
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
          className={styledFormControl}
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
        {loading ?
          <Button
            onClick={refetch}
            variant="outlined"
            className={analyzingButton}
          >
            <span className={analyzingSpan}>Die Daten werden analysiert</span>
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
                className={analyzingButton}
              >
                neu analysieren
              </Button>
            </Badge>
          </div>
        }
        <div className={scrollContainer}>
          {messageGroupsFiltered.map((messageGroup) => (
            <Paper
              key={messageGroup.title}
              elevation={2}
              className={styledPaper}
            >
              <div className={title}>{messageGroup.title}</div>
              {messageGroup.messages.map((m, i) => (
                <div
                  className={row}
                  key={`${m.text}Index${i}`}
                >
                  <p
                    className={styledA}
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
                    className={outsideLink}
                    onClick={() => {
                      const url = `${appBaseUrl()}Daten/${m.url.join(
                        '/',
                      )}?onlyShowActivePath=true`
                      if (
                        window.matchMedia('(display-mode: standalone)').matches
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
        {!loading && messageGroups.length === 0 && (
          <div>Juhui. Offenbar gibt es nichts zu meckern!</div>
        )}
      </div>
    </ErrorBoundary>
  )
})
