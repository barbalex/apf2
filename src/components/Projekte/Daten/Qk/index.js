import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import { FaExternalLinkAlt } from 'react-icons/fa'
import ErrorBoundary from 'react-error-boundary'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
import fetchKtZh from '../../../../modules/fetchKtZh'
import query from './query'
import qk from './qk'
import checkTpopOutsideZh from './checkTpopOutsideZh'
import storeContext from '../../../../storeContext'

const Container = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
`
const FieldsContainer = styled.div`
  padding: 10px;
  overflow: auto !important;
  height: 100%;
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
const StyledButton = styled(Button)`
  margin-bottom: 15px !important;
  margin-top: -5px !important;
  color: ${props =>
    props.loading === 'true'
      ? '#D84315 !important'
      : 'rgb(46, 125, 50) !important'};
`

const Qk = ({ treeName }) => {
  const store = useContext(storeContext)
  const { ktZh, openTree2WithActiveNodeArray } = store
  const { activeNodeArray } = store[treeName]

  const [berichtjahr, setBerichtjahr] = useState(standardQkYear())
  const [filter, setFilter] = useState('')

  const { data, error, loading, refetch } = useQuery(query, {
    // want to explicitly show user re-loading
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      berichtjahr,
      isBerichtjahr: !!berichtjahr,
      apId:
        activeNodeArray.length > 3
          ? activeNodeArray[3]
          : '99999999-9999-9999-9999-999999999999',
      projId:
        activeNodeArray.length > 1
          ? activeNodeArray[1]
          : '99999999-9999-9999-9999-999999999999',
    },
  })

  const onChangeBerichtjahr = useCallback(
    event => setBerichtjahr(+event.target.value),
    [],
  )
  const onChangeFilter = useCallback(event => setFilter(event.target.value), [])

  const gqlMessageGroups = sortBy(qk({ berichtjahr, data }), 'title')
    .filter(q => !q.query)
    .filter(q => q.messages.length)
  if (ktZh) {
    const outsideZhMessageGroup = checkTpopOutsideZh({ data, ktZh })
    if (outsideZhMessageGroup.messages.length)
      gqlMessageGroups.push(outsideZhMessageGroup)
  }

  const messageGroups = sortBy([...gqlMessageGroups], 'title')
  const messageGroupsFiltered = messageGroups.filter(messageGroup => {
    if (!!filter && messageGroup.title && messageGroup.title.toLowerCase) {
      return messageGroup.title.toLowerCase().includes(filter.toLowerCase())
    }
    return true
  })

  useEffect(() => {
    !ktZh && fetchKtZh(store)
  }, [ktZh, store])

  if (error) return `Fehler: ${error.message}`
  return (
    <ErrorBoundary>
      <Container>
        <FormTitle title="Qualitätskontrollen" />
        <FieldsContainer>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="berichtjahr">Berichtjahr</InputLabel>
            <Input
              id="berichtjahr"
              value={berichtjahr}
              type="number"
              onChange={onChangeBerichtjahr}
            />
          </StyledFormControl>
          <StyledFormControl fullWidth>
            <InputLabel htmlFor="filter">
              nach Abschnitts-Titel filtern
            </InputLabel>
            <Input id="filter" value={filter} onChange={onChangeFilter} />
          </StyledFormControl>
          <StyledButton
            onClick={() => refetch()}
            variant="outlined"
            loading={loading.toString()}
          >
            {loading ? 'Die Daten werden analysiert...' : 'neu analysieren'}
          </StyledButton>
          {messageGroupsFiltered.map((messageGroup, index) => (
            <StyledPaper key={index} elevation={2}>
              <Title>{messageGroup.title}</Title>
              {messageGroup.messages.map(m => (
                <Row key={m.url.join()}>
                  <StyledA
                    onClick={() => openTree2WithActiveNodeArray(m.url)}
                    title="in Strukturbaum 2 öffnen"
                  >
                    {m.text}
                  </StyledA>
                  <OutsideLink
                    onClick={() =>
                      typeof window !== 'undefined' &&
                      window.open(`${appBaseUrl()}Daten/${m.url.join('/')}`)
                    }
                    title="in neuem Tab öffnen"
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
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Qk)
