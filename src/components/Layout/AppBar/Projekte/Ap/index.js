import React, { useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link } from 'gatsby'

import isMobilePhone from '../../../../../modules/isMobilePhone'
import setUrlQueryValue from '../../../../../modules/setUrlQueryValue'
import More from '../More'
import Daten from './Daten'
import storeContext from '../../../../../storeContext'

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

const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-right-color: ${(props) =>
    props.followed === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-left-color: ${(props) =>
    props.preceded === 'true'
      ? ' rgba(255, 255, 255, 0.25)'
      : ' rgba(255, 255, 255, 0.5)'} !important;
  border-top-left-radius: ${(props) =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-bottom-left-radius: ${(props) =>
    props.preceded === 'true' ? '0' : '4px'} !important;
  border-top-right-radius: ${(props) =>
    props.followed === 'true' ? '0' : '4px'} !important;
  border-bottom-right-radius: ${(props) =>
    props.followed === 'true' ? '0' : '4px'} !important;
  margin-right: ${(props) =>
    props.followed === 'true' ? '-1px' : 'unset'} !important;
  text-transform: none !important;
`
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
    dataFilterClone1To2,
    user,
    view,
    setView,
    urlQuery,
    setUrlQuery,
    cloneTree2From1,
    tree,
  } = store
  const { projIdInActiveNodeArray } = store.tree

  /**
   * need to clone projekteTabs
   * because otherwise removing elements errors out (because elements are sealed)
   */
  const projekteTabs = urlQuery.projekteTabs.slice().filter((el) => !!el)
  const exporteIsActive = !!projIdInActiveNodeArray
  const isMobile = isMobilePhone()

  const { token } = user
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'

  const isProjekt = tree.activeNodeArray[0] === 'Projekte'

  const onClickButton = useCallback(
    (name) => {
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
          remove(projekteTabs, (el) => el === name)
          if (name === 'tree2') {
            // close all tree2-tabs
            remove(projekteTabs, (el) => el.includes('2'))
          }
        } else {
          projekteTabs.push(name)
          if (name === 'tree2') {
            cloneTree2From1()
            dataFilterClone1To2()
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
    [
      cloneTree2From1,
      isMobile,
      dataFilterClone1To2,
      projekteTabs,
      setUrlQuery,
      urlQuery,
    ],
  )
  const onClickTree = useCallback(() => onClickButton('tree'), [onClickButton])
  const onClickKarte = useCallback(
    () => onClickButton('karte'),
    [onClickButton],
  )
  const onClickFilter = useCallback(
    () => onClickButton('filter'),
    [onClickButton],
  )
  const onClickFilter2 = useCallback(
    () => onClickButton('filter2'),
    [onClickButton],
  )
  const onClickExporte = useCallback(
    () => onClickButton('exporte'),
    [onClickButton],
  )
  const onClickTree2 = useCallback(
    () => onClickButton('tree2'),
    [onClickButton],
  )
  const setViewEkf = useCallback(() => setView('ekf'), [setView])
  const onClickEkPlanung = useCallback(() => {
    // eslint-disable-next-line no-unused-vars
    const [projectTitle, projectId, ...rest] = tree.activeNodeArray
    tree.setActiveNodeArray([projectTitle, projectId, 'EK-Planung'])
  }, [tree])

  return (
    <>
      {!isMobile && (
        <SiteTitle variant="outlined" component={Link} to="/" title="Home">
          AP Flora
        </SiteTitle>
      )}
      <MenuDiv>
        <>
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
                followed={projekteTabs.includes('daten')?.toString()}
                onClick={onClickTree}
                data-id="nav-tree1"
              >
                Strukturbaum
              </StyledButton>
              <Daten />
              <StyledButton
                variant={projekteTabs.includes('filter') ? 'outlined' : 'text'}
                preceded={projekteTabs.includes('daten')?.toString()}
                followed={projekteTabs.includes('karte')?.toString()}
                onClick={onClickFilter}
                data-id="nav-filter1"
                title="Daten filtern"
              >
                Filter
              </StyledButton>
              <StyledButton
                variant={projekteTabs.includes('karte') ? 'outlined' : 'text'}
                preceded={projekteTabs.includes('filter')?.toString()}
                followed={(
                  (!isMobile &&
                    exporteIsActive &&
                    projekteTabs.includes('exporte')) ||
                  (!isMobile &&
                    !exporteIsActive &&
                    projekteTabs.includes('tree2'))
                )?.toString()}
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
                  preceded={projekteTabs.includes('karte')?.toString()}
                  followed={projekteTabs.includes('tree2')?.toString()}
                  onClick={onClickExporte}
                  data-id="nav-exporte"
                >
                  Exporte
                </StyledButton>
              )}
              {!isMobile && (
                <StyledButton
                  variant={projekteTabs.includes('tree2') ? 'outlined' : 'text'}
                  preceded={(
                    (exporteIsActive && projekteTabs.includes('exporte')) ||
                    (!exporteIsActive && projekteTabs.includes('karte'))
                  )?.toString()}
                  followed={projekteTabs.includes('daten2')?.toString()}
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
                  preceded={projekteTabs.includes('daten2')?.toString()}
                  followed={projekteTabs.includes('karte2')?.toString()}
                  onClick={onClickFilter2}
                  data-id="nav-filter2"
                  title="Daten filtern"
                >
                  Filter 2
                </StyledButton>
              )}
              {!isMobile && isProjekt && (
                <StyledButton
                  variant="text"
                  preceded={false?.toString()}
                  followed={false.toString()}
                  onClick={onClickEkPlanung}
                  data-id="ek-planung"
                  title="EK und EKF planen"
                >
                  EK-Planung
                </StyledButton>
              )}
            </>
          )}
          <DokuButton variant="text" component={Link} to="/Dokumentation/">
            Dokumentation
          </DokuButton>
          <More onClickExporte={onClickExporte} role={role} />
        </>
      </MenuDiv>
    </>
  )
}

export default observer(ProjekteAppBar)
