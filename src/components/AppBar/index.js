// @flow
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import gql from 'graphql-tag'

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import getActiveNodes from '../../modules/getActiveNodes'
import More from './More'

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`
// need to prevent boolean props from being passed to dom
const StyledButton = ({ preceded, followed, ...rest }) => {
  const StyledButton = styled(Button)`
    color: white !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    border-right-color: ${followed
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-left-color: ${preceded
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
    border-top-left-radius: ${preceded ? '0' : '4px'} !important;
    border-bottom-left-radius: ${preceded ? '0' : '4px'} !important;
    border-top-right-radius: ${followed ? '0' : '4px'} !important;
    border-bottom-right-radius: ${followed ? '0' : '4px'} !important;
    margin-right: ${followed ? '-1px' : 'unset'} !important;
  `
  return <StyledButton {...rest} />
}
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const enhance = compose(
  withState('anchorEl', 'setAnchorEl', null),
  withHandlers({
    onClickButton: () => (name, client, projekteTabs) => {
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: [name] })
      } else {
        if (projekteTabs.includes(name)) {
          remove(projekteTabs, el => el === name)
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            client.mutate({
              mutation: gql`
                mutation cloneTree2From1 {
                  cloneTree2From1 @client
                }
              `,
            })
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
  })
)

const MyAppBar = ({
  onClickButton,
  anchorEl,
  setAnchorEl,
  setShowDeletions,
}: {
  onClickButton: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  setShowDeletions: () => void,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const activeNodeArray = get(data, 'tree.activeNodeArray')
      const activeNodes = getActiveNodes(activeNodeArray)
      /**
       * need to clone projekteTabs
       * because otherwise removing elements errors out (because elements are sealed)
       */
      const projekteTabs = clone(get(data, 'urlQuery.projekteTabs', []))
      const exporteIsActive = !!activeNodes.projekt
      const isMobile = isMobilePhone()

      return (
        <ErrorBoundary>
          <StyledAppBar position="static">
            <StyledToolbar>
              <Typography variant="title" color="inherit">
                {isMobile ? '' : 'AP Flora'}
              </Typography>
              <MenuDiv>
                <StyledButton
                  variant={projekteTabs.includes('tree') ? 'outlined' : 'text'}
                  followed={projekteTabs.includes('daten')}
                  onClick={() => onClickButton('tree', client, projekteTabs)}
                >
                  Strukturbaum
                </StyledButton>
                <StyledButton
                  variant={projekteTabs.includes('daten') ? 'outlined' : 'text'}
                  preceded={projekteTabs.includes('tree')}
                  followed={projekteTabs.includes('karte')}
                  onClick={() => onClickButton('daten', client, projekteTabs)}
                >
                  Daten
                </StyledButton>
                <StyledButton
                  variant={projekteTabs.includes('karte') ? 'outlined' : 'text'}
                  preceded={projekteTabs.includes('daten')}
                  followed={
                    (!isMobile &&
                      exporteIsActive &&
                      projekteTabs.includes('exporte')) ||
                    (!isMobile &&
                      !exporteIsActive &&
                      projekteTabs.includes('tree2'))
                  }
                  onClick={() => onClickButton('karte', client, projekteTabs)}
                >
                  Karte
                </StyledButton>
                {!isMobile &&
                  exporteIsActive && (
                    <StyledButton
                      variant={
                        projekteTabs.includes('exporte') ? 'outlined' : 'text'
                      }
                      preceded={projekteTabs.includes('karte')}
                      followed={projekteTabs.includes('tree2')}
                      onClick={() => {
                        setAnchorEl(null)
                        onClickButton('exporte', client, projekteTabs)
                      }}
                    >
                      Exporte
                    </StyledButton>
                  )}
                {!isMobile && (
                  <StyledButton
                    variant={
                      projekteTabs.includes('tree2') ? 'outlined' : 'text'
                    }
                    preceded={
                      (exporteIsActive && projekteTabs.includes('exporte')) ||
                      (!exporteIsActive && projekteTabs.includes('karte'))
                    }
                    followed={projekteTabs.includes('daten2')}
                    onClick={() => onClickButton('tree2', client, projekteTabs)}
                  >
                    Strukturbaum 2
                  </StyledButton>
                )}
                {!isMobile && (
                  <StyledButton
                    variant={
                      projekteTabs.includes('daten2') ? 'outlined' : 'text'
                    }
                    preceded={projekteTabs.includes('tree2')}
                    onClick={() =>
                      onClickButton('daten2', client, projekteTabs)
                    }
                  >
                    Daten 2
                  </StyledButton>
                )}
                <More
                  onClickButton={onClickButton}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  setShowDeletions={setShowDeletions}
                />
              </MenuDiv>
            </StyledToolbar>
          </StyledAppBar>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default enhance(MyAppBar)
