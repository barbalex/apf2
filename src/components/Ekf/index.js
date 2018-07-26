// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import intersection from 'lodash/intersection'
import { Subscribe } from 'unstated'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import allUsersFuck from './allUsersData'
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

const enhance = compose(allUsersFuck)

const EkfContainer = ({ allUsersData }: { allUsersData: Object }) => {
  console.log('allUsersData:', allUsersData)
  if (allUsersData.loading) return null

  return (
    <Subscribe to={[ErrorState]}>
      {errorState => (
        <Query query={data1Gql}>
          {({ error, data: data1 }) => {
            if (error) return `Fehler: ${error.message}`
            const userName = get(data1, 'user.name')
            const projekteTabs = [...get(data1, 'urlQuery.projekteTabs', [])]
            const tabs = intersection(treeTabValues, projekteTabs)
            // TODO
            console.log('EkfContainer:', {
              data1,
              userName,
            })
            const treeFlex =
              projekteTabs.length === 2 && tabs.length === 2
                ? 0.33
                : tabs.length === 0
                  ? 1
                  : 1 / tabs.length
            const isPrint = get(data1, 'isPrint')
            if (isPrint) return <div>print ekf</div>

            return (
              <Container data-loading={false}>
                <ErrorBoundary>
                  <ReflexContainer orientation="vertical">
                    {tabs.includes('tree') && (
                      <ReflexElement flex={treeFlex}>
                        <EkfList />
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
      )}
    </Subscribe>
  )
}

export default enhance(EkfContainer)
