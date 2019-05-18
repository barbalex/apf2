import React, { useContext, useState, useCallback } from 'react'
import Button from '@material-ui/core/Button'
import remove from 'lodash/remove'
import styled from 'styled-components'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link } from 'gatsby'

import isMobilePhone from '../../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../../modules/setUrlQueryValue'
import More from './More'
import EkfYear from './EkfYear'
import User from './User'
import Daten from './Daten'
import storeContext from '../../../../storeContext'

const SiteTitle = styled(Button)`
  display: none !important;
  color: white !important;
  font-size: 20px !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-width: 0 !important;
  text-transform: none !important;
  @media (min-width: 750px) {
    display: block !important;
  }
  :hover {
    border-width: 1px !important;
  }
`
const MenuDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    text-transform: none !important;
  `
  return <StyledButton {...rest} />
}
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
`
const NormalViewButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  text-transform: none !important;
`

const ProjekteAppBar = () => {
  const store = useContext(storeContext)
  const {
    nodeFilterClone1To2,
    user,
    view,
    setView,
    urlQuery,
    setUrlQuery,
    cloneTree2From1,
    treeActiveNodes,
  } = store

  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = urlQuery.projekteTabs.slice().filter(el => !!el)
  const exporteIsActive = !!treeActiveNodes.projekt
  const isMobile = isMobilePhone()

  const { token, name: username } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const [userOpen, setUserOpen] = useState(false)

  const onClickButton = useCallback(
    name => {
      if (isMobile) {
        // show one tab only
        setUrlQueryValue({
          key: 'projekteTabs',
          value: [name],
          urlQuery,
          setUrlQuery,
        })
      } else {
        if (projekteTabs.includes(name)) {
          remove(projekteTabs, el => el === name)
          if (name === 'tree2') {
            // close all tree2-tabs
            remove(projekteTabs, el => el.includes('2'))
          }
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            cloneTree2From1()
            nodeFilterClone1To2()
          }
        }
        setUrlQueryValue({
          key: 'projekteTabs',
          value: projekteTabs,
          urlQuery,
          setUrlQuery,
        })
      }
    },
    [projekteTabs],
  )
  const onClickTree = useCallback(() => onClickButton('tree'))
  const onClickKarte = useCallback(() => onClickButton('karte'))
  const onClickFilter = useCallback(() => onClickButton('filter'))
  const onClickFilter2 = useCallback(() => onClickButton('filter2'))
  const onClickExporte = useCallback(() => onClickButton('exporte'))
  const onClickTree2 = useCallback(() => onClickButton('tree2'))
  const setViewNormal = useCallback(() => setView('normal'))
  const setViewEkf = useCallback(() => setView('ekf'))
  const toggleUserOpen = useCallback(() => setUserOpen(!userOpen), [userOpen])

  return (
    <>
      {!isMobile && (
        <SiteTitle variant="outlined" component={Link} to="/" title="Home">
          {view === 'ekf'
            ? 'AP Flora: Erfolgs-Kontrolle Freiwillige'
            : 'AP Flora'}
        </SiteTitle>
      )}
      <MenuDiv>
        <>
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
                data-id="nav-tree1"
              >
                Strukturbaum
              </StyledButton>
              <Daten />
              <StyledButton
                variant={projekteTabs.includes('filter') ? 'outlined' : 'text'}
                preceded={projekteTabs.includes('daten')}
                followed={projekteTabs.includes('karte')}
                onClick={onClickFilter}
                data-id="nav-filter1"
                title="Daten filtern"
              >
                Filter
              </StyledButton>
              <StyledButton
                variant={projekteTabs.includes('karte') ? 'outlined' : 'text'}
                preceded={projekteTabs.includes('filter')}
                followed={
                  (!isMobile &&
                    exporteIsActive &&
                    projekteTabs.includes('exporte')) ||
                  (!isMobile &&
                    !exporteIsActive &&
                    projekteTabs.includes('tree2'))
                }
                onClick={onClickKarte}
                data-id="nav-karte1"
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
                  data-id="nav-exporte"
                >
                  Exporte
                </StyledButton>
              )}
              {!isMobile && (
                <StyledButton
                  variant={projekteTabs.includes('tree2') ? 'outlined' : 'text'}
                  preceded={
                    (exporteIsActive && projekteTabs.includes('exporte')) ||
                    (!exporteIsActive && projekteTabs.includes('karte'))
                  }
                  followed={projekteTabs.includes('daten2')}
                  onClick={onClickTree2}
                  data-id="nav-tree2"
                >
                  Strukturbaum 2
                </StyledButton>
              )}
              {!isMobile && projekteTabs.includes('tree2') && (
                <Daten treeNr="2" />
              )}
              {!isMobile && projekteTabs.includes('tree2') && (
                <StyledButton
                  variant={
                    projekteTabs.includes('filter2') ? 'outlined' : 'text'
                  }
                  preceded={projekteTabs.includes('daten2')}
                  followed={projekteTabs.includes('karte2')}
                  onClick={onClickFilter2}
                  data-id="nav-filter2"
                  title="Daten filtern"
                >
                  Filter 2
                </StyledButton>
              )}
            </>
          )}
          <DokuButton
            variant="text"
            component={Link}
            to="/Dokumentation/Benutzer/"
          >
            Dokumentation
          </DokuButton>
          <More onClickExporte={onClickExporte} role={role} />
        </>
      </MenuDiv>
    </>
  )
}

export default observer(ProjekteAppBar)
