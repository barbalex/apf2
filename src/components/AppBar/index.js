// @flow
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Query } from 'react-apollo'
import get from 'lodash/get'
import clone from 'lodash/clone'
import gql from 'graphql-tag'
import { Subscribe } from 'unstated'

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import logout from '../../modules/logout'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import getActiveNodes from '../../modules/getActiveNodes'
import DeleteState from '../../state/Delete'

const StyledAppBar = styled(AppBar)`
  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`
const StyledButton = styled(Button)`
  color: ${props =>
    props['data-visible']
      ? 'rgb(255, 255, 255) !important'
      : 'rgba(255, 255, 255, 0.298039) !important'};
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const StyledMoreVertIcon = styled(MoreVertIcon)`
  color: white !important;
`
const Version = styled.div`
  padding: 12px 16px;
  color: rgba(0, 0, 0, 0.87);
  user-select: none;
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
              `
            })
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
    watchVideos: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J'
      )
    },
    showDeletedDatasets: ({ setAnchorEl, setShowDeletions }) => () => {
      setAnchorEl(null)
      setShowDeletions(true)
    },
  }),
)

const MyAppBar = ({
  onClickButton,
  showDeletedDatasets,
  watchVideos,
  anchorEl,
  setAnchorEl,
  setShowDeletions,
}: {
  onClickButton: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
  setShowDeletions: () => void,
}) =>
  <Subscribe to={[DeleteState]}>
    {deleteState => (
      <Query query={dataGql} >
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
          const datasetsDeleted = deleteState.state.datasets

          return (
            <ErrorBoundary>
              <StyledAppBar position="static">
                <StyledToolbar>
                  <Typography variant="title" color="inherit">
                    {isMobile ? '' : 'AP Flora'}
                  </Typography>
                  <MenuDiv>
                    <StyledButton
                      data-visible={projekteTabs.includes('tree')}
                      onClick={() => onClickButton('tree', client, projekteTabs)}
                    >
                      Strukturbaum
                    </StyledButton>
                    <StyledButton
                      data-visible={projekteTabs.includes('daten')}
                      onClick={() => onClickButton('daten', client, projekteTabs)}
                    >
                      Daten
                    </StyledButton>
                    <StyledButton
                      data-visible={projekteTabs.includes('karte')}
                      onClick={() => onClickButton('karte', client, projekteTabs)}
                    >
                      Karte
                    </StyledButton>
                    {!isMobile &&
                      exporteIsActive && (
                        <StyledButton
                          data-visible={projekteTabs.includes('exporte')}
                          onClick={() => {
                            setAnchorEl(null)
                            onClickButton('exporte', client, projekteTabs)
                          }}
                        >
                          Exporte
                        </StyledButton>
                      )
                    }
                    {!isMobile && (
                      <StyledButton
                        data-visible={projekteTabs.includes('tree2')}
                        onClick={() => onClickButton('tree2', client, projekteTabs)}
                      >
                        Strukturbaum 2
                      </StyledButton>
                    )}
                    {!isMobile && (
                      <StyledButton
                        data-visible={projekteTabs.includes('daten2')}
                        onClick={() => onClickButton('daten2', client, projekteTabs)}
                      >
                        Daten 2
                      </StyledButton>
                    )}

                    <div>
                      <IconButton
                        aria-label="Mehr"
                        aria-owns={anchorEl ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={event => setAnchorEl(event.currentTarget)}
                      >
                        <StyledMoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        {isMobile &&
                          exporteIsActive && (
                            <MenuItem
                              onClick={() => {
                                setAnchorEl(null)
                                onClickButton('exporte', client, projekteTabs)
                              }}
                              disabled={projekteTabs.includes('exporte')}
                            >
                              Exporte
                            </MenuItem>
                          )}
                        <MenuItem
                          onClick={showDeletedDatasets}
                          disabled={datasetsDeleted.length === 0}
                        >
                          gelöschte Datensätze wiederherstellen
                        </MenuItem>
                        <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
                        <MenuItem
                          onClick={() => {
                            setAnchorEl(null)
                            logout()
                          }}
                        >
                          {`${get(data, 'user.name')} abmelden`}
                        </MenuItem>
                        <Version>Version: 1.1.0 vom 8.7.2018</Version>
                      </Menu>
                    </div>
                  </MenuDiv>
                </StyledToolbar>
              </StyledAppBar>
            </ErrorBoundary>
          )
        }}
      </Query>
    )}
  </Subscribe>

export default enhance(MyAppBar)
