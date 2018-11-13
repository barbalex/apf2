// @flow
import React, { Fragment } from 'react'
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
import app from 'ampersand-app'
import jwtDecode from 'jwt-decode'

import isMobilePhone from '../../modules/isMobilePhone'
import ErrorBoundary from '../shared/ErrorBoundary'
import withLocalData from './withLocalData'
import setUrlQueryValue from '../../modules/setUrlQueryValue'
import setEkfYear from './setEkfYear'
import getActiveNodes from '../../modules/getActiveNodes'
import More from './More'
import setView from './setView'
import EkfYear from './EkfYear'
import User from './User'
import Daten from './Daten'
import withNodeFilter from '../../state/withNodeFilter'

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
  withLocalData,
  withNodeFilter,
  withState('ekfYearState', 'setEkfYearState', null),
  withState('userOpen', 'setUserOpen', false),
  withHandlers({
    onClickButton: ({ nodeFilterState, localData }) => name => {
      const projekteTabs = get(localData, 'urlQuery.projekteTabs', [])
      if (isMobilePhone()) {
        // show one tab only
        setUrlQueryValue({ key: 'projekteTabs', value: [name] })
      } else {
        if (projekteTabs.includes(name)) {
          remove(projekteTabs, el => el === name)
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            app.client.mutate({
              mutation: gql`
                mutation cloneTree2From1 {
                  cloneTree2From1 @client
                }
              `,
            })
            nodeFilterState.clone1To2()
          }
        }
        setUrlQueryValue({ key: 'projekteTabs', value: projekteTabs })
      }
    },
    setViewNormal: () => () => {
      app.client.mutate({
        mutation: setView,
        variables: { value: 'normal' },
      })
    },
    setViewEkf: () => () => {
      app.client.mutate({
        mutation: setView,
        variables: { value: 'ekf' },
      })
    },
    setEkfYear: () => value => {
      const ekfRefDate = new Date().setMonth(new Date().getMonth() - 2)
      const ekfRefYear = new Date(ekfRefDate).getFullYear()
      app.client.mutate({
        mutation: setEkfYear,
        variables: { value: value ? +value : ekfRefYear },
      })
    },
    toggleUserOpen: ({ userOpen, setUserOpen }) => () => setUserOpen(!userOpen),
  }),
)

const MyAppBar = ({
  onClickButton,
  setShowDeletions,
  setViewNormal,
  setViewEkf,
  setEkfYear,
  userOpen,
  toggleUserOpen,
  localData,
}: {
  onClickButton: () => void,
  setShowDeletions: () => void,
  setViewNormal: () => void,
  setViewEkf: () => void,
  setEkfYear: () => void,
  userOpen: boolean,
  toggleUserOpen: () => void,
  localData: Object,
}) => {
  if (localData.error) return `Fehler: ${localData.error.message}`
  const activeNodeArray = get(localData, 'tree.activeNodeArray')
  const activeNodes = getActiveNodes(activeNodeArray)
  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = clone(get(localData, 'urlQuery.projekteTabs', []))
  const exporteIsActive = !!activeNodes.projekt
  const isMobile = isMobilePhone()
  const view = get(localData, 'view')

  const token = get(localData, 'user.token')
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'
  const username = get(localData, 'user.name')

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
            {view === 'ekf' && (
              <EkfYear
                value={get(localData, 'ekfYear')}
                setEkfYear={setEkfYear}
              />
            )}
            {view === 'ekf' && !isFreiwillig && (
              <NormalViewButton onClick={setViewNormal}>
                Normal-Ansicht
              </NormalViewButton>
            )}
            {view === 'ekf' && isFreiwillig && (
              <Fragment>
                <NormalViewButton onClick={toggleUserOpen}>
                  {`Benutzer: ${username}`}
                </NormalViewButton>
                <User
                  username={username}
                  userOpen={userOpen}
                  toggleUserOpen={toggleUserOpen}
                />
              </Fragment>
            )}
            {view === 'normal' && (
              <Fragment>
                {isFreiwillig && (
                  <NormalViewButton onClick={setViewEkf}>
                    EKF-Ansicht
                  </NormalViewButton>
                )}
                <StyledButton
                  variant={projekteTabs.includes('tree') ? 'outlined' : 'text'}
                  followed={projekteTabs.includes('daten')}
                  onClick={() => onClickButton('tree')}
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
                  onClick={() => onClickButton('karte')}
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
                    onClick={() => onClickButton('exporte')}
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
                    onClick={() => onClickButton('tree2')}
                  >
                    Strukturbaum 2
                  </StyledButton>
                )}
                {!isMobile && <Daten data={localData} treeNr="2" />}
              </Fragment>
            )}
            <More
              onClickButton={onClickButton}
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
