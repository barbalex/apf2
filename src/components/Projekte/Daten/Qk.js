// @flow
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import styled from 'styled-components'
import Paper from 'material-ui/Paper'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'

import FormTitle from '../../shared/FormTitle'
import appBaseUrl from '../../../modules/appBaseUrl'
import standardQkYear from '../../../modules/standardQkYear'
import fetchQk from '../../../modules/fetchQk'
import ErrorBoundary from '../../shared/ErrorBoundary'

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
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  inject('store'),
  withState('berichtjahr', 'changeBerichtjahr', standardQkYear()),
  withHandlers({
    onChangeBerichtjahr: props => event => {
      const { value } = event.target
      const { changeBerichtjahr, store, tree } = props
      changeBerichtjahr(value)
      if (
        (isNaN(value) && value.length === 4) ||
        (!isNaN(value) && value > 1000)
      ) {
        // reset messages
        store.qk.setMessages([])
        // call fetchQk and pass it berichtjahr and apId
        const apId = tree.activeNodes.ap
        fetchQk({ store, berichtjahr: value, apId })
      }
    },
    onChangeFilter: props => event =>
      props.store.qk.setFilter(event.target.value),
  }),
  withLifecycle({
    onDidMount({ berichtjahr, changeBerichtjahr, store, tree }) {
      // reset messages
      store.qk.setMessages([])
      // call fetchQk and pass it berichtjahr and apId
      const apId = tree.activeNodes.ap
      fetchQk({ store, berichtjahr, apId })
    },
  }),
  observer
)

const Qk = ({
  store,
  tree,
  berichtjahr,
  onChangeBerichtjahr,
  onChangeFilter,
}: {
  store: Object,
  tree: Object,
  berichtjahr: number,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
}) => {
  const { filter, messages, loading } = store.qk
  const pureMessageArrays = toJS(messages)
  const messageArraysFiltered = filter
    ? pureMessageArrays.filter(messageArray => {
        if (
          messageArray[0] &&
          messageArray[0].hw &&
          messageArray[0].hw.toLowerCase
        ) {
          return messageArray[0].hw.toLowerCase().includes(filter.toLowerCase())
        }
        return false
      })
    : pureMessageArrays
  const loadingMessage = loading
    ? 'Die Daten werden analysiert...'
    : 'Analyse abgeschlossen'

  return (
    <ErrorBoundary>
      <Container>
        <FormTitle tree={tree} title="Qualitätskontrollen" />
        <FieldsContainer>
          <FormControl fullWidth>
            <InputLabel htmlFor="berichtjahr">Berichtjahr</InputLabel>
            <StyledInput
              id="berichtjahr"
              value={berichtjahr}
              type="number"
              onChange={onChangeBerichtjahr}
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
}

export default enhance(Qk)
