// @flow
import React from 'react'
import styled from 'styled-components'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import intersection from 'lodash/intersection'
import compose from 'recompose/compose'
import Loadable from 'react-loadable'
import jwtDecode from 'jwt-decode'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import dataByUserNameGql from './dataByUserName.graphql'
import dataByAdresseIdGql from './dataByAdresseId.graphql'
import dataWithDateByUserNameGql from './dataWithDateByUserName.graphql'
import dataWithDateByAdresseIdGql from './dataWithDateByAdresseId.graphql'
import withErrorState from '../../state/withErrorState'
import EkfList from './List'
import Loading from '../shared/Loading'

/**
 * TODO:
 * on mount
 * check if ekfAdresseId exists
 * if so: use byAdresse queries
 */

const Tpopfreiwkontr = Loadable({
  loader: () => import('../Projekte/Daten/Tpopfreiwkontr'),
  loading: Loading,
})

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

const enhance = compose(withErrorState)

const EkfContainer = ({ errorState }: { errorState: Object }) => (
  <Query query={data1Gql}>
    {({ error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`
      const userName = get(data1, 'user.name')
      const projekteTabs = [...get(data1, 'urlQuery.projekteTabs', [])]
      const tabs = intersection(treeTabValues, projekteTabs)
      const treeFlex =
        projekteTabs.length === 2 && tabs.length === 2
          ? 0.33
          : tabs.length === 0
            ? 1
            : 1 / tabs.length
      const isPrint = get(data1, 'isPrint')
      const jahr = get(data1, 'ekfYear')
      const ekfAdresseId = get(data1, 'ekfAdresseId')
      const variables = ekfAdresseId
        ? { id: ekfAdresseId, jahr }
        : { userName, jahr }
      const token = get(data1, 'user.token')
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
            const data = merge(data1, data2)
            const activeNodeArray = get(data, 'tree.activeNodeArray')
            const tpopkontrId = activeNodeArray[9]

            if (isPrint && tpopkontrId)
              return (
                <Tpopfreiwkontr
                  id={activeNodeArray[9]}
                  activeNodeArray={activeNodeArray}
                  refetchTree={refetch}
                  errorState={errorState}
                  role={role}
                  dimensions={{ width: 1000 }}
                />
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
                    {tabs.includes('tree') &&
                      tabs.includes('daten') && <ReflexSplitter />}
                    {tabs.includes('daten') && (
                      <ReflexElementForEKF
                        propagateDimensions={true}
                        renderOnResizeRate={100}
                        renderOnResize={true}
                      >
                        {tpopkontrId && (
                          <Tpopfreiwkontr
                            id={activeNodeArray[9]}
                            activeNodeArray={activeNodeArray}
                            refetchTree={refetch}
                            errorState={errorState}
                            role={role}
                          />
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
    }}
  </Query>
)

export default enhance(EkfContainer)
