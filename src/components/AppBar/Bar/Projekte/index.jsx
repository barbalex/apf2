import React, { useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import jwtDecode from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link, useParams, useLocation } from 'react-router-dom'

import isMobilePhone from '../../../../modules/isMobilePhone'
import More from './More'
import Daten from './Daten'
import storeContext from '../../../../storeContext'
import useSearchParamsState from '../../../../modules/useSearchParamsState'

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

const ProjekteBar = () => {
  const { projId } = useParams()
  const { search } = useLocation()

  const store = useContext(storeContext)
  const { user } = store
  const { resetTree2Src } = store.tree

  const exporteIsActive = !!projId
  const isMobile = isMobilePhone()

  const token = user?.token
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null

  const [projekteTabs, setProjekteTabs] = useSearchParamsState(
    'projekteTabs',
    isMobilePhone() ? ['tree'] : ['tree', 'daten'],
  )

  const onClickButton = useCallback(
    (name) => {
      if (isMobile) {
        // show one tab only
        setProjekteTabs([name])
      } else {
        const newProjekteTabs = [...projekteTabs]
        if (newProjekteTabs.includes(name)) {
          remove(newProjekteTabs, (el) => el === name)
          if (name === 'tree2') {
            // close all tree2-tabs
            remove(newProjekteTabs, (el) => el.includes('2'))
          }
        } else {
          newProjekteTabs.push(name)
        }
        setProjekteTabs(newProjekteTabs)
      }
    },
    [isMobile, setProjekteTabs, projekteTabs],
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
  const onClickTree2 = useCallback(() => {
    resetTree2Src()
    onClickButton('tree2')
  }, [onClickButton, resetTree2Src])

  return (
    <>
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
          (!isMobile && exporteIsActive && projekteTabs.includes('exporte')) ||
          (!isMobile && !exporteIsActive && projekteTabs.includes('tree2'))
        )?.toString()}
        onClick={onClickKarte}
        data-id="nav-karte1"
      >
        Karte
      </StyledButton>
      {!isMobile && exporteIsActive && (
        <StyledButton
          variant={projekteTabs.includes('exporte') ? 'outlined' : 'text'}
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
      {!isMobile && projekteTabs.includes('tree2') && <Daten treeNr="2" />}
      {!isMobile && projekteTabs.includes('tree2') && (
        <StyledButton
          variant={projekteTabs.includes('filter2') ? 'outlined' : 'text'}
          preceded={projekteTabs.includes('daten2')?.toString()}
          followed={projekteTabs.includes('karte2')?.toString()}
          onClick={onClickFilter2}
          data-id="nav-filter2"
          title="Daten filtern"
        >
          Filter 2
        </StyledButton>
      )}
      {!isMobile && (
        <StyledButton
          variant="text"
          preceded={false?.toString()}
          followed={false.toString()}
          component={Link}
          to={`/Daten/Projekte/${projId}/EK-Planung${search}`}
          data-id="ek-planung"
          title="EK und EKF planen"
        >
          EK-Planung
        </StyledButton>
      )}
      <DokuButton
        variant="text"
        component={Link}
        to={`/Dokumentation/${search}`}
      >
        Dokumentation
      </DokuButton>
      <More onClickExporte={onClickExporte} role={role} />
    </>
  )
}

export default observer(ProjekteBar)
