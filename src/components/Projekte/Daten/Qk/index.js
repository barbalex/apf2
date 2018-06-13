// @flow
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
//import withLifecycle from '@hocs/with-lifecycle'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
//import fetchQk from './fetchQk'
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
  margin-top: 10px;
  color: ${props =>
    props.loading ? 'rgba(0, 0, 0, 0.87)' : 'rgb(46, 125, 50)'};
`
const StyledA = styled.a`
  color: inherit;
  font-weight: normal;
  font-size: 12px;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('berichtjahr', 'setBerichtjahr', standardQkYear()),
  withState('filter', 'setFilter', ''),
  withState('messages', 'setMessages', []),
  withState('outsideZhChecked', 'setOutsideZhChecked', false),
  withState('checkingOutsideZh', 'setCheckingOutsideZh', false),
  withHandlers({
    addMessages: ({ messages, setMessages }) => newMessages => {
      setMessages([...messages, newMessages])
    }
  }),
  withHandlers({
    onChangeBerichtjahr: ({
      setBerichtjahr,
      tree,
      apId,
      addMessages,
      activeNodes,
      errorState,
    }) => ({ event, data }) => {
      const { value } = event.target
      setBerichtjahr(value)
      /*
      if (
        (isNaN(value) && value.length === 4) ||
        (!isNaN(value) && value > 1000)
      ) {
        // call fetchQk and pass it berichtjahr and apId
        fetchQk({
          berichtjahr: value,
          apId,
          addMessages,
          activeNodes,
          errorState,
        })
      }*/
    },
    onChangeFilter: ({ setFilter }) => event =>
      setFilter(event.target.value),
  }),
  /*
  withLifecycle({
    onDidMount({
      berichtjahr,
      setBerichtjahr,
      tree,
      apId,
      addMessages,
      activeNodes,
      errorState
    }) {
      // call fetchQk and pass it berichtjahr and apId
      fetchQk({
        berichtjahr,
        apId,
        addMessages,
        activeNodes,
        errorState
      })
    },
  }),*/
)

const Qk = ({
  tree,
  apId,
  berichtjahr,
  onChangeBerichtjahr,
  onChangeFilter,
  filter,
  treeName,
  messages,
  addMessages,
  activeNodes,
  outsideZhChecked,
  setOutsideZhChecked,
  checkingOutsideZh,
  setCheckingOutsideZh,
  errorState,
}: {
  tree: Object,
  apId: String,
  berichtjahr: Number,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
  filter: String,
  treeName: String,
  messages: Array<Object>,
  addMessages: () => void,
  activeNodes: Array<Object>,
  outsideZhChecked: Boolean,
  setOutsideZhChecked: () => void,
  checkingOutsideZh: Boolean,
  setCheckingOutsideZh: () => void,
  errorState: Object,
}) =>
  <Query query={data1Gql}>
    {({ loading, error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`
      const projId = get(data1, `${treeName}.activeNodeArray[1]`)

      return (
          <Query
            query={data2Gql}
            // pass berichtjahr when queries exist that actually use it
            variables={{ berichtjahr, isBerichtjahr: !!berichtjahr, apId, projId }}
            //variables={{ apId, projId }}
          >
            {({ loading, error, data }) => {
              const qks = qk(berichtjahr).filter(q => !!q.query)
              let gqlMessages = []
              if (Object.keys(data).length > 0) {
                gqlMessages = qks
                  .filter(q => q.type === 'query')
                  .map(q =>
                    q.data(data)
                  )
              }

              !outsideZhChecked && checkTpopOutsideZh({
                data,
                addMessages,
                setOutsideZhChecked,
                checkingOutsideZh,
                setCheckingOutsideZh,
                errorState,
              })

              const messageArrays = [...gqlMessages, ...messages]
              const messageArraysFiltered = filter
                ? messageArrays.filter(messageArray => {
                    if (
                      messageArray[0] &&
                      messageArray[0].hw &&
                      messageArray[0].hw.toLowerCase
                    ) {
                      return messageArray[0].hw.toLowerCase().includes(filter.toLowerCase())
                    }
                    return false
                  })
                : messageArrays.filter(messageArray => {
                  if (
                    messageArray[0] &&
                    messageArray[0].hw
                  ) {
                    // only return values with hw
                    return true
                  }
                  return false
                })
                if (error) return `Fehler: ${error.message}`
                const loadingMessage = loading
                  ? 'Die Daten werden analysiert...'
                  : 'Analyse abgeschlossen'

                return (
                  <ErrorBoundary>
                  <Container>
                    <FormTitle title="Qualitätskontrollen" />
                    <FieldsContainer>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="berichtjahr">Berichtjahr</InputLabel>
                        <StyledInput
                          id="berichtjahr"
                          value={berichtjahr}
                          type="number"
                          onChange={(event) => onChangeBerichtjahr({ event, data })}
                        />
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="filter">
                          nach Abschnitts-Titel filtern
                        </InputLabel>
                        <StyledInput id="filter" value={filter} onChange={onChangeFilter} />
                      </FormControl>
                      <LoadingIndicator loading={loading}>
                        {loadingMessage}
                      </LoadingIndicator>
                      {messageArraysFiltered.map((messageArray, index) => (
                        <StyledPaper key={index}>
                          <Title>{messageArray[0].hw}</Title>
                          {messageArray.map(m => (
                            <div key={m.url.join()}>
                              <StyledA
                                href={`${appBaseUrl}/${m.url.join('/')}`}
                                target="_blank"
                              >
                                {m.text.join('; ')}
                              </StyledA>
                            </div>
                          ))}
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
