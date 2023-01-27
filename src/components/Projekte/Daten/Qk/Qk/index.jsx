import React, { useState, useCallback, useContext } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Badge from '@mui/material/Badge'
import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import { FaExternalLinkAlt } from 'react-icons/fa'
import CircularProgress from '@mui/material/CircularProgress'
import { useParams, useLocation } from 'react-router-dom'

import appBaseUrl from '../../../../../modules/appBaseUrl'
import standardQkYear from '../../../../../modules/standardQkYear'
import query from './query'
import createMessageFunctions from './createMessageFunctions'
import storeContext from '../../../../../storeContext'
import ErrorBoundary from '../../../../shared/ErrorBoundary'
import Error from '../../../../shared/Error'
import useSearchParamsState from '../../../../../modules/useSearchParamsState'
import isMobilePhone from '../../../../../modules/isMobilePhone'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`
const StyledPaper = styled(Paper)`
  padding: 10px;
  margin-bottom: 12px !important;
  background-color: transparent !important;
`
const Title = styled.div`
  font-weight: bold;
`
const StyledA = styled.p`
  color: inherit;
  font-weight: normal;
  font-size: 12px;
  text-decoration-line: underline;
  cursor: pointer;
  margin-bottom: 0;
  margin-top: 0;
  padding: 2px 0;
`
const Row = styled.div`
  display: flex;
`
const OutsideLink = styled.div`
  margin-left: 8px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`
const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const AnalyzingButton = styled(Button)`
  margin-bottom: 15px !important;
  margin-top: -5px !important;
  color: rgb(46, 125, 50) !important;
  text-transform: none !important;
`
const AnalyzingSpan = styled.span`
  padding-right: 13px;
`

const Qk = ({ qkNameQueries, qks }) => {
  const { apId, projId } = useParams()
  const { search } = useLocation()

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )

  const store = useContext(storeContext)
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

  const onChangeBerichtjahr = useCallback(
    (event) => setBerichtjahr(+event.target.value),
    [],
  )
  const onChangeFilter = useCallback(
    (event) => setFilter(event.target.value),
    [],
  )

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
      <Container>
        <StyledFormControl fullWidth variant="standard">
          <InputLabel htmlFor="berichtjahr">Berichtjahr</InputLabel>
          <Input
            id="berichtjahr"
            value={berichtjahr}
            type="number"
            onChange={onChangeBerichtjahr}
          />
        </StyledFormControl>
        <StyledFormControl fullWidth variant="standard">
          <InputLabel htmlFor="filter">
            nach Abschnitts-Titel filtern
          </InputLabel>
          <Input id="filter" value={filter} onChange={onChangeFilter} />
        </StyledFormControl>
        {loading ? (
          <AnalyzingButton onClick={() => refetch()} variant="outlined">
            <AnalyzingSpan>Die Daten werden analysiert</AnalyzingSpan>
            <CircularProgress />
          </AnalyzingButton>
        ) : (
          <div>
            <Badge badgeContent={messageGroupsFiltered.length} color="primary">
              <AnalyzingButton onClick={() => refetch()} variant="outlined">
                neu analysieren
              </AnalyzingButton>
            </Badge>
          </div>
        )}
        {messageGroupsFiltered.map((messageGroup) => (
          <StyledPaper key={messageGroup.title} elevation={2}>
            <Title>{messageGroup.title}</Title>
            {messageGroup.messages.map((m, i) => (
              <Row key={`${m.text}Index${i}`}>
                <StyledA
                  onClick={() =>
                    openTree2WithActiveNodeArray({
                      activeNodeArray: m.url,
                      search,
                      projekteTabs,
                      setProjekteTabs,
                    })
                  }
                  title="in Strukturbaum 2 öffnen"
                >
                  {m.text}
                </StyledA>
                <OutsideLink
                  onClick={() => {
                    const url = `${appBaseUrl()}Daten/${m.url.join('/')}`
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
                </OutsideLink>
              </Row>
            ))}
          </StyledPaper>
        ))}
        {!loading && messageGroups.length === 0 && (
          <div>Juhui. Offenbar gibt es nichts zu meckern!</div>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Qk)
