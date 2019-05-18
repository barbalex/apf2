import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
import fetchKtZh from '../../../../modules/fetchKtZh'
import ErrorBoundary from '../../../shared/ErrorBoundary'
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
const StyledA = styled.a`
  color: inherit;
  font-weight: normal;
  font-size: 12px;
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
  const { ktZh, setKtZh, addError } = store
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

  const onChangeBerichtjahr = useCallback(event =>
    setBerichtjahr(+event.target.value),
  )
  const onChangeFilter = useCallback(event => setFilter(event.target.value))

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
    if (!ktZh) fetchKtZh({ setKtZh, addError })
  }, [])

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
            <StyledPaper key={index}>
              <Title>{messageGroup.title}</Title>
              {messageGroup.messages.map(m => (
                <div key={m.url.join()}>
                  <StyledA
                    href={`${appBaseUrl()}/${m.url.join('/')}`}
                    target="_blank"
                  >
                    {m.text}
                  </StyledA>
                </div>
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
