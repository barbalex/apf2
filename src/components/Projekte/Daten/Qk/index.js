// @flow
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import withLifecycle from '@hocs/with-lifecycle'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import FormTitle from '../../../shared/FormTitle'
import appBaseUrl from '../../../../modules/appBaseUrl'
import standardQkYear from '../../../../modules/standardQkYear'
import fetchQk from '../../../../modules/fetchQk'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import qk from './qk'

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
  inject('store'),
  withState('berichtjahr', 'changeBerichtjahr', standardQkYear()),
  withHandlers({
    onChangeBerichtjahr: ({ changeBerichtjahr, store, tree }) => event => {
      const { value } = event.target
      changeBerichtjahr(value)
      if (
        (isNaN(value) && value.length === 4) ||
        (!isNaN(value) && value > 1000)
      ) {
        // call fetchQk and pass it berichtjahr and apId
        const apId = tree.activeNodes.ap
        fetchQk({ store, berichtjahr: value, apId })
      }
    },
    onChangeFilter: ({ store }) => event =>
      store.qk.setFilter(event.target.value),
  }),
  withLifecycle({
    onDidMount({ berichtjahr, changeBerichtjahr, store, tree }) {
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
  treeName,
}: {
  store: Object,
  tree: Object,
  berichtjahr: number,
  onChangeBerichtjahr: () => void,
  onChangeFilter: () => void,
  treeName: String,
}) =>
<Query query={data1Gql}>
  {({ loading, error, data }) => {
    if (error) return `Fehler: ${error.message}`
    const projId = get(data, `${treeName}.activeNodeArray[1]`)
    const apId = get(data, `${treeName}.activeNodeArray[3]`)

    return (
        <Query
          query={data2Gql}
          //variables={{ berichtjahr, apId, projId }}
          variables={{ apId, projId }}
        >
          {({ loading, error, data }) => {
            const qks = qk(berichtjahr).filter(q => !!q.query)
            const gqlMessages = qks
            // only results with data
            .filter(q => get(data, `${q.query}.totalCount`, 0) > 0)
            // convert
            // TODO:
            // make this simpler after moving all calls to graphql
            .map(q => {
              const qData = get(data, `${q.query}.nodes`, [])
              return qData.map(o => ({
                proj_id: o.projId,
                ap_id: o.apId,
                hw: q.title,
                text: [q.text(o)],
                url: q.url(o)
              }))
            })

            const { filter } = store.qk
            const messageArrays = [...gqlMessages, ...toJS(store.qk.messages)]
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
              : messageArrays
              if (error) return `Fehler: ${error.message}`
              const loadingMessage = (store.qkloading || loading)
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
          }}
        </Query>
      )
    }}
  </Query>

export default enhance(Qk)
