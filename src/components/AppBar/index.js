// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
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

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'
import logout from '../../modules/logout'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import getActiveNodes from '../../modules/getActiveNodes'

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

const enhance = compose(
  inject('store'),
  withState('anchorEl', 'setAnchorEl', null),
  withHandlers({
    onClickButton: ({ store }) => (name, client, projekteTabs) => {
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ client, key: 'projekteTabs', value: [name] })
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
        setUrlQueryValue({ client, key: 'projekteTabs', value: projekteTabs })
      }
    },
    watchVideos: ({ setAnchorEl }) => () => {
      setAnchorEl(null)
      window.open(
        'https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J'
      )
    },
    showDeletedDatasets: ({ setAnchorEl, store }) => () => {
      setAnchorEl(null)
      store.toggleShowDeletedDatasets()
    },
  }),
  observer
)

const MyAppBar = ({
  store,
  onClickButton,
  showDeletedDatasets,
  watchVideos,
  anchorEl,
  setAnchorEl,
}: {
  store: Object,
  onClickButton: () => void,
  showDeletedDatasets: () => void,
  watchVideos: () => void,
  anchorEl: Object,
  setAnchorEl: () => void,
}) => 
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
                      disabled={store.deletedDatasets.length === 0}
                    >
                      gelöschte Datensätze wiederherstellen
                    </MenuItem>
                    <MenuItem onClick={watchVideos}>Video-Anleitungen</MenuItem>
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null)
                        logout({ store, client })
                      }}
                    >{`${get(data, 'user.name')} abmelden`}</MenuItem>
                  </Menu>
                </div>
              </MenuDiv>
            </StyledToolbar>
          </StyledAppBar>
        </ErrorBoundary>
      )
    }}
  </Query>

export default enhance(MyAppBar)
