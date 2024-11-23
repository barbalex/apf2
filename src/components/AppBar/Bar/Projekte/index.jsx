import { memo, useContext, useCallback, useMemo } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import { jwtDecode } from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link, useParams, useLocation } from 'react-router-dom'

import { isMobilePhone } from '../../../../modules/isMobilePhone.js'
import { More } from './More/index.jsx'
import { Daten } from './Daten.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { useSearchParamsState } from '../../../../modules/useSearchParamsState.js'
import { MenuBar, buttonWidth } from '../../../shared/MenuBar/index.jsx'

export const StyledButton = styled(Button)`
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  border-right-color: ${(props) =>
    props.followed === 'true' ?
      ' rgba(255, 255, 255, 0.25)'
    : ' rgba(255, 255, 255, 0.5)'} !important;
  border-left-color: ${(props) =>
    props.preceded === 'true' ?
      ' rgba(255, 255, 255, 0.25)'
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
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
`
export const StyledDesktopButton = styled(StyledButton)`
  @media (max-width: 1095px) {
    display: none !important;
  }
`
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
`

export const ProjekteMenus = memo(
  observer(() => {
    const { projId } = useParams()
    const { search } = useLocation()

    const store = useContext(StoreContext)
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
    const onClickTree = useCallback(
      () => onClickButton('tree'),
      [onClickButton],
    )
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

    const showTree = projekteTabs.includes('tree')
    const showDaten = projekteTabs.includes('daten')
    const showFilter = projekteTabs.includes('filter')
    const showExporte = projekteTabs.includes('exporte')
    const showKarte = projekteTabs.includes('karte')
    const showTree2 = projekteTabs.includes('tree2')
    const showDaten2 = projekteTabs.includes('daten2')
    const showFilter2 = projekteTabs.includes('filter2')
    const showKarte2 = projekteTabs.includes('karte2')

    return (
      <>
        <StyledButton
          name="tree"
          variant={showTree ? 'outlined' : 'text'}
          followed={showDaten?.toString()}
          onClick={onClickTree}
          data-id="nav-tree1"
          width={134}
        >
          Strukturbaum
        </StyledButton>
        <Daten />
        <StyledButton
          variant={showFilter ? 'outlined' : 'text'}
          preceded={showDaten?.toString()}
          followed={showKarte?.toString()}
          onClick={onClickFilter}
          data-id="nav-filter1"
          title="Daten filtern"
          width={77}
        >
          Filter
        </StyledButton>
        <StyledButton
          variant={showKarte ? 'outlined' : 'text'}
          preceded={showFilter?.toString()}
          followed={(
            (!isMobile && exporteIsActive && showExporte) ||
            (!isMobile && !exporteIsActive && showTree2)
          )?.toString()}
          onClick={onClickKarte}
          data-id="nav-karte1"
          width={77}
        >
          Karte
        </StyledButton>
        {!isMobile && exporteIsActive && (
          <StyledButton
            variant={showExporte ? 'outlined' : 'text'}
            preceded={showKarte?.toString()}
            followed={showTree2?.toString()}
            onClick={onClickExporte}
            data-id="nav-exporte"
            width={95}
          >
            Exporte
          </StyledButton>
        )}
        {!isMobile && (
          <StyledDesktopButton
            variant={showTree2 ? 'outlined' : 'text'}
            preceded={(
              (exporteIsActive && showExporte) ||
              (!exporteIsActive && showKarte)
            )?.toString()}
            followed={showDaten2?.toString()}
            onClick={onClickTree2}
            data-id="nav-tree2"
            width={147}
          >
            Strukturbaum 2
          </StyledDesktopButton>
        )}
        {!isMobile && showTree2 && <Daten treeNr="2" />}
        {!isMobile && showTree2 && (
          <StyledDesktopButton
            variant={showFilter2 ? 'outlined' : 'text'}
            preceded={showDaten2?.toString()}
            followed={showKarte2?.toString()}
            onClick={onClickFilter2}
            data-id="nav-filter2"
            title="Daten filtern"
            width={88}
          >
            Filter 2
          </StyledDesktopButton>
        )}
        {!isMobile && !!projId && (
          <StyledDesktopButton
            variant="text"
            preceded={false?.toString()}
            followed={false.toString()}
            component={Link}
            to={`/Daten/Projekte/${projId}/EK-Planung${search}`}
            data-id="ek-planung"
            title="EK und EKF planen"
            width={101}
          >
            EK-Planung
          </StyledDesktopButton>
        )}
        <DokuButton
          variant="text"
          component={Link}
          to={`/Dokumentation/${search}`}
          width={129}
        >
          Dokumentation
        </DokuButton>
        <More
          onClickExporte={onClickExporte}
          role={role}
        />
      </>
    )
  }),
)
