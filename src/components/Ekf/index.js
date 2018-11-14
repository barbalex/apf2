// @flow
import React, { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import intersection from 'lodash/intersection'
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
import withErrorState from '../../state/withErrorState'
import EkfList from './List'
import Fallback from '../shared/Fallback'

/**
 * TODO:
 * on mount
 * check if ekfAdresseId exists
 * if so: use byAdresse queries
 */

const Tpopfreiwkontr = lazy(() => import('../Projekte/Daten/Tpopfreiwkontr'))

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
const treeTabValues = ['tree', 'daten', 'karte', 'exporte']

const enhance = compose(
  withLocalData,
  withErrorState,
)

const EkfContainer = ({
  errorState,
  localData,
}: {
  errorState: Object,
  localData: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  const userName = get(localData, 'user.name')
  const projekteTabs = [...get(localData, 'urlQuery.projekteTabs', [])]
  const tabs = intersection(treeTabValues, projekteTabs)
  const treeFlex =
    projekteTabs.length === 2 && tabs.length === 2
      ? 0.33
      : tabs.length === 0
      ? 1
      : 1 / tabs.length
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

        if (isPrint && tpopkontrId)
          return (
            <Suspense fallback={<Fallback />}>
              <Tpopfreiwkontr
                id={activeNodeArray[9]}
                activeNodeArray={activeNodeArray}
                treeName={treeName}
                refetchTree={refetch}
                errorState={errorState}
                role={role}
                dimensions={{ width: 1000 }}
              />
            </Suspense>
          )

        return (
          <Container data-loading={loading}>
            <ErrorBoundary>
              <ReflexContainer orientation="vertical">
                {tabs.includes('tree') && (
                  <ReflexElement
                    flex={treeFlex}
                    propagateDimensions={true}
                    renderOnResizeRate={200}
                    renderOnResize={true}
                  >
                    <EkfList data={data} loading={loading} />
                  </ReflexElement>
                )}
                {tabs.includes('tree') && tabs.includes('daten') && (
                  <ReflexSplitter />
                )}
                {tabs.includes('daten') && (
                  <ReflexElementForEKF
                    flex={1 - treeFlex}
                    propagateDimensions={true}
                    renderOnResizeRate={100}
                    renderOnResize={true}
                  >
                    {tpopkontrId ? (
                      <Suspense fallback={<Fallback />}>
                        <Tpopfreiwkontr
                          id={activeNodeArray[9]}
                          activeNodeArray={activeNodeArray}
                          treeName={treeName}
                          refetchTree={refetch}
                          errorState={errorState}
                          role={role}
                          dimensions={{ width: 1000 }}
                        />
                      </Suspense>
                    ) : (
                      <div />
                    )}
                  </ReflexElementForEKF>
                )}
              </ReflexContainer>
            </ErrorBoundary>
          </Container>
        )
      }}
    </Query>
  )
}

export default enhance(EkfContainer)
