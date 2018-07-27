// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import merge from 'lodash/merge'
import intersection from 'lodash/intersection'
import { Subscribe } from 'unstated'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import allUsersGql from './allUsers.graphql'
import ErrorState from '../../state/Error'
import EkfList from './List'

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
const treeTabValues = ['tree', 'daten', 'karte', 'exporte']

const enhance = compose()

const EkfContainer = () => (
  <Subscribe to={[ErrorState]}>
    {errorState => (
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
          const variables = { userName, jahr }

          return (
            <Query query={allUsersGql} variables={variables}>
              {({ error, data: data2 }) => {
                if (error) return `Fehler: ${error.message}`
                const data = merge(data1, data2)

                if (isPrint) return <div>print ekf</div>

                return (
                  <Container data-loading={false}>
                    <ErrorBoundary>
                      <ReflexContainer orientation="vertical">
                        {tabs.includes('tree') && (
                          <ReflexElement
                            flex={treeFlex}
                            propagateDimensions={true}
                            renderOnResizeRate={200}
                            renderOnResize={true}
                          >
                            <EkfList data={data} />
                          </ReflexElement>
                        )}
                        {tabs.includes('tree') &&
                          tabs.includes('daten') && <ReflexSplitter />}
                        {tabs.includes('daten') && (
                          <ReflexElement
                            propagateDimensions={true}
                            renderOnResizeRate={100}
                            renderOnResize={true}
                          >
                            <div>ekf</div>
                          </ReflexElement>
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
    )}
  </Subscribe>
)

export default enhance(EkfContainer)
