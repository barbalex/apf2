// @flow
import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import compose from 'recompose/compose'
import sortBy from 'lodash/sortBy'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
import fetchKtZh from '../../../../modules/fetchKtZh'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import withData from './withData'
import qk from './qk'
import checkTpopOutsideZh from './checkTpopOutsideZh'
import mobxStoreContext from '../../../../mobxStoreContext'

const Container = styled.div`
  height: 100%;
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
const LoadingIndicator = styled.div`
  margin-bottom: 15px;
  margin-top: -5px;
  color: ${props => (props.loading ? '#D84315' : 'rgb(46, 125, 50)')};
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
const LoadingLine = styled.div`
  display: flex;
`

const enhance = compose(
  withLocalData,
  withData,
)

const Qk = ({
  tree,
  apId,
  treeName,
  activeNodes,
  localData,
  data,
}: {
  tree: Object,
  apId: String,
  treeName: String,
  activeNodes: Array<Object>,
  localData: Object,
  data: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  if (data.error) return `Fehler: ${data.error.message}`

  const { ktZh, setKtZh, addError } = useContext(mobxStoreContext)

  const [berichtjahr, setBerichtjahr] = useState(standardQkYear())
  const [filter, setFilter] = useState('')

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
          <LoadingLine>
            <LoadingIndicator loading={data.loading}>
              {data.loading
                ? 'Die Daten werden analysiert...'
                : 'Analyse abgeschlossen'}
            </LoadingIndicator>
            {/*<Button onClick={() => data.refetch()}>neu analysieren</Button>*/}
          </LoadingLine>
          {messageGroupsFiltered.map((messageGroup, index) => (
            <StyledPaper key={index}>
              <Title>{messageGroup.title}</Title>
              {messageGroup.messages.map(m => (
                <div key={m.url.join()}>
                  <StyledA
                    href={`${appBaseUrl}/${m.url.join('/')}`}
                    target="_blank"
                  >
                    {m.text}
                  </StyledA>
                </div>
              ))}
            </StyledPaper>
          ))}
        </FieldsContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(Qk)
