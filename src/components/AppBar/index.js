// @flow
import React, { useContext, useState, useCallback } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import clone from 'lodash/clone'
import gql from 'graphql-tag'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { withApollo } from 'react-apollo'

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import getActiveNodes from '../../modules/getActiveNodes'
import More from './More'
import EkfYear from './EkfYear'
import User from './User'
import Daten from './Daten'
import mobxStoreContext from '../../mobxStoreContext'

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
const NormalViewButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const enhance = compose(
  withApollo,
  withLocalData,
  observer,
)

const MyAppBar = ({
  localData,
  setShowDeletions,
  client,
}: {
  localData: Object,
  setShowDeletions: () => void,
  client: Object,
}) => {
  const { nodeFilterClone1To2, user, view, setView } = useContext(
    mobxStoreContext,
  )

  const activeNodeArray = get(localData, 'tree.activeNodeArray')
  const activeNodes = getActiveNodes(activeNodeArray)
  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = clone(get(localData, 'urlQuery.projekteTabs', []))
  const exporteIsActive = !!activeNodes.projekt
  const isMobile = isMobilePhone()

  const { token, name: username } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const [userOpen, setUserOpen] = useState(false)

  const onClickButton = useCallback(
    (name: string) => {
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: [name], client })
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
            nodeFilterClone1To2()
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs, client })
      }
    },
    [projekteTabs],
  )
  const onClickTree = useCallback(() => onClickButton('tree'))
  const onClickKarte = useCallback(() => onClickButton('karte'))
  const onClickExporte = useCallback(() => onClickButton('exporte'))
  const onClickTree2 = useCallback(() => onClickButton('tree2'))
  const setViewNormal = useCallback(() => setView('normal'))
  const setViewEkf = useCallback(() => setView('ekf'))
  const toggleUserOpen = useCallback(() => setUserOpen(!userOpen), [userOpen])

  if (localData.error) return `Fehler: ${localData.error.message}`

  return (
    <ErrorBoundary>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Typography variant="title" color="inherit">
            {isMobile
              ? ''
              : view === 'ekf'
              ? 'AP Flora: Erfolgs-Kontrolle Freiwillige'
              : 'AP Flora'}
          </Typography>
          <MenuDiv>
            {view === 'ekf' && <EkfYear />}
            {view === 'ekf' && !isFreiwillig && (
              <NormalViewButton onClick={setViewNormal}>
                Normal-Ansicht
              </NormalViewButton>
            )}
            {view === 'ekf' && isFreiwillig && (
              <>
                <NormalViewButton onClick={toggleUserOpen}>
                  {`Benutzer: ${username}`}
                </NormalViewButton>
                <User
                  username={username}
                  userOpen={userOpen}
                  toggleUserOpen={toggleUserOpen}
                />
              </>
            )}
            {view === 'normal' && (
              <>
                {isFreiwillig && (
                  <NormalViewButton onClick={setViewEkf}>
                    EKF-Ansicht
                  </NormalViewButton>
                )}
                <StyledButton
                  name="tree"
                  variant={projekteTabs.includes('tree') ? 'outlined' : 'text'}
                  followed={projekteTabs.includes('daten')}
                  onClick={onClickTree}
                >
                  Strukturbaum
                </StyledButton>
                <Daten data={localData} />
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
                  onClick={onClickKarte}
                >
                  Karte
                </StyledButton>
                {!isMobile && exporteIsActive && (
                  <StyledButton
                    variant={
                      projekteTabs.includes('exporte') ? 'outlined' : 'text'
                    }
                    preceded={projekteTabs.includes('karte')}
                    followed={projekteTabs.includes('tree2')}
                    onClick={onClickExporte}
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
                    onClick={onClickTree2}
                  >
                    Strukturbaum 2
                  </StyledButton>
                )}
                {!isMobile && <Daten data={localData} treeNr="2" />}
              </>
            )}
            <More
              onClickExporte={onClickExporte}
              setShowDeletions={setShowDeletions}
              role={role}
            />
          </MenuDiv>
        </StyledToolbar>
      </StyledAppBar>
    </ErrorBoundary>
  )
}

export default enhance(MyAppBar)
