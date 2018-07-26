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
import Button from '@material-ui/core/Button'

// when Karte was loaded async, it did not load,
// but only in production!
import ErrorBoundary from '../shared/ErrorBoundary'
import data1Gql from './data1.graphql'
import data2Gql from './data2.graphql'
import ErrorState from '../../state/Error'
import logout from '../../modules/logout'
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
const ErrorContainer = styled.div`
  padding: 15px;
`
const LogoutButton = styled(Button)`
  margin-top: 10px !important;
`
const treeTabValues = ['tree', 'daten', 'karte', 'exporte']

const enhance = compose()

const EkfContainer = () => (
  <Subscribe to={[ErrorState]}>
    {errorState => (
      <Query query={data1Gql}>
        {({ error, data: data1 }) => {
          if (error) return `Fehler: ${error.message}`
          const token = get(data1, 'user.token')
          const userName = get(data1, 'user.name')
          const projekteTabs = [...get(data1, 'urlQuery.projekteTabs', [])]
          const tabs = intersection(treeTabValues, projekteTabs)
          // TODO
          const jahr = 2018
          const variables = { userName, jahr }
          console.log('ProjektContainer:', {
            data1,
            userName,
          })

          return (
            <Query query={data2Gql} variables={variables}>
              {({ loading, error, data: data2, client, refetch }) => {
                if (error) {
                  console.log('ProjektContainer, error:', error.message)
                  if (
                    error.message.includes('permission denied') ||
                    error.message.includes('keine Berechtigung')
                  ) {
                    console.log('ProjektContainer, token:', token)
                    // during login don't show permission error
                    if (!token) return null
                    // if token is not accepted, ask user to logout
                    return (
                      <ErrorContainer>
                        <div>Ihre Anmeldung ist nicht mehr gültig.</div>
                        <div>Bitte melden Sie sich neu an.</div>
                        <LogoutButton
                          variant="outlined"
                          onClick={() => {
                            logout()
                          }}
                        >
                          Neu anmelden
                        </LogoutButton>
                      </ErrorContainer>
                    )
                  }
                  return `Fehler: ${error.message}`
                }

                const data = merge(data1, data2)
                console.log('data:', data)
                // remove 2 to treat all same
                const treeFlex =
                  projekteTabs.length === 2 && tabs.length === 2
                    ? 0.33
                    : tabs.length === 0
                      ? 1
                      : 1 / tabs.length
                const isPrint = get(data, 'isPrint')

                if (isPrint) return <div>print ekf</div>

                return (
                  <Container data-loading={loading}>
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
          )
        }}
      </Query>
    )}
  </Subscribe>
)

export default enhance(EkfContainer)
