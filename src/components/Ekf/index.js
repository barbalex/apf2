// @flow
/**
 * Stopped lazy loading Tpopfreiwkontr
 * because Reflex would often not show layout
 */
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import compose from 'recompose/compose'
import jwtDecode from 'jwt-decode'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import dataByUserNameGql from './dataByUserName'
import dataByAdresseIdGql from './dataByAdresseId'
import dataWithDateByUserNameGql from './dataWithDateByUserName'
import dataWithDateByAdresseIdGql from './dataWithDateByAdresseId'
import EkfList from './List'
import Tpopfreiwkontr from '../Projekte/Daten/Tpopfreiwkontr'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  cursor: ${props => (props['data-loading'] ? 'wait' : 'inherit')};
  @media print {
    display: block;
    height: auto !important;
  }
`
const ReflexElementForEKF = styled(ReflexElement)`
  > div {
    border-left: 1px solid rgb(46, 125, 50);
  }
`

const enhance = compose(withLocalData)

const EkfContainer = ({ localData }: { localData: Object }) => {
  if (localData.error) return `Fehler: ${localData.error.message}`

  const userName = get(localData, 'user.name')
  const isPrint = get(localData, 'isPrint')
  const jahr = get(localData, 'ekfYear')
  const ekfAdresseId = get(localData, 'ekfAdresseId')
  const variables = ekfAdresseId
    ? { id: ekfAdresseId, jahr }
    : { userName, jahr }
  const token = get(localData, 'user.token')
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()
  let query = !!ekfAdresseId ? dataByAdresseIdGql : dataByUserNameGql
  if (ekfRefYear !== jahr) {
    query = !!ekfAdresseId
      ? dataWithDateByAdresseIdGql
      : dataWithDateByUserNameGql
  }

  return (
    <Query query={query} variables={variables}>
      {({ error, data: data2, refetch, loading }) => {
        if (error) return `Fehler: ${error.message}`
        const data = merge(localData, data2)
        const activeNodeArray = get(data, 'tree.activeNodeArray')
        const tpopkontrId = activeNodeArray[9]
        const treeName = 'tree'

        if (isPrint && tpopkontrId) {
          return (
            <Tpopfreiwkontr
              id={activeNodeArray[9]}
              activeNodeArray={activeNodeArray}
              treeName={treeName}
              refetchTree={refetch}
              role={role}
              dimensions={{ width: 1000 }}
            />
          )
        }

        return (
          <Container data-loading={loading}>
            <ErrorBoundary>
              <ReflexContainer orientation="vertical">
                <ReflexElement
                  flex={0.33}
                  propagateDimensions={true}
                  renderOnResizeRate={200}
                  renderOnResize={true}
                >
                  <EkfList data={data} loading={loading} />
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElementForEKF
                  flex={0.67}
                  propagateDimensions={true}
                  renderOnResizeRate={100}
                  renderOnResize={true}
                >
                  {tpopkontrId && (
                    <Tpopfreiwkontr
                      id={activeNodeArray[9]}
                      activeNodeArray={activeNodeArray}
                      treeName={treeName}
                      refetchTree={refetch}
                      role={role}
                      dimensions={{ width: 1000 }}
                    />
                  )}
                </ReflexElementForEKF>
              </ReflexContainer>
            </ErrorBoundary>
          </Container>
        )
      }}
    </Query>
  )
}

export default enhance(EkfContainer)
