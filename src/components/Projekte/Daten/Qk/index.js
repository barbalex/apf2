// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
//import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
import fetchKtZh from '../../../../modules/fetchKtZh'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import qk from './qk'
import checkTpopOutsideZh from './checkTpopOutsideZh'

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
  color: ${props =>
    props.loading ? '#D84315' : 'rgb(46, 125, 50)'};
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
  withState('berichtjahr', 'setBerichtjahr', standardQkYear()),
  withState('filter', 'setFilter', ''),
  withHandlers({
    onChangeBerichtjahr: ({ setBerichtjahr }) => event =>
      setBerichtjahr(+event.target.value),
    onChangeFilter: ({ setFilter }) => event =>
      setFilter(event.target.value),
  }),
  withLifecycle({
    onDidMount({ ktZh, setKtZh, errorState }) {
      if (!ktZh) fetchKtZh({ setKtZh, errorState })
    },
  }),
)

const Qk = ({
  tree,
  apId,
  berichtjahr,
  onChangeBerichtjahr,
  onChangeFilter,
  filter,
  treeName,
  activeNodes,
  errorState,
  ktZh,
  setKtZh,
}: {
  tree: Object,
  apId: String,
  berichtjahr: Number,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
  filter: String,
  treeName: String,
  activeNodes: Array<Object>,
  errorState: Object,
  ktZh: Object,
  setKtZh: () => void,
}) =>
  <Query query={data1Gql}>
    {({ loading, error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`
      const projId = get(data1, `${treeName}.activeNodeArray[1]`)

      return (
        <Query
          query={data2Gql}
          variables={{ berichtjahr, isBerichtjahr: !!berichtjahr, apId, projId }}
        >
          {({ loading, error, data, refetch }) => {
            if (error) return `Fehler: ${error.message}`
            const gqlMessageGroups = sortBy(
              qk({ berichtjahr, data }),
              'title'
            )
              .filter(q => !q.query)
              .filter(q => q.messages.length)

            const messageGroups = sortBy(
              [
                ...gqlMessageGroups,
                checkTpopOutsideZh({ data, ktZh })
              ],
              'title'
            )
            const messageGroupsFiltered = messageGroups.filter(
              messageGroup => {
                if (
                  !!filter &&
                  messageGroup.title &&
                  messageGroup.title.toLowerCase
                ) {
                  return messageGroup.title.toLowerCase().includes(filter.toLowerCase())
                }
                return true
              }
            )

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
                      <LoadingIndicator loading={loading}>
                        {
                          loading
                          ? 'Die Daten werden analysiert...'
                          : 'Analyse abgeschlossen'
                        }
                      </LoadingIndicator>
                      {/*<Button onClick={() => refetch()}>neu analysieren</Button>*/}
                    </LoadingLine>
                    {messageGroupsFiltered.map((messageGroup, index) => (
                      <StyledPaper key={index}>
                        <Title>{messageGroup.title}</Title>
                        {
                          messageGroup.messages.map(m => (
                            <div key={m.url.join()}>
                              <StyledA
                                href={`${appBaseUrl}/${m.url.join('/')}`}
                                target="_blank"
                              >
                                {m.text}
                              </StyledA>
                            </div>
                          ))
                        }
                      </StyledPaper>
                    ))}
                  </FieldsContainer>
                </Container>
              </ErrorBoundary>
            )
          }}
        </Query>
      )
    }}
  </Query>

export default enhance(Qk)
