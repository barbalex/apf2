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
import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { minWidthToShowAllMenus } from '../../index.jsx'

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
  ${(props) => props.hide === 'true' && 'display: none !important;'}
`
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  width: ${(props) => `${props.width}px` ?? 'unset'} !important;
`

export const ProjekteMenus = memo(
  observer(({ showAllMenus }) => {
    const { projId } = useParams()
    const { search } = useLocation()

    const store = useContext(StoreContext)
    const { user } = store
    const { resetTree2Src } = store.tree

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

    const treeIsVisible = projekteTabs.includes('tree')
    const datenIsVisible = projekteTabs.includes('daten')
    const filterIsVisible = projekteTabs.includes('filter')
    const exporteIsVisible = projekteTabs.includes('exporte')
    const karteIsVisible = projekteTabs.includes('karte')
    const tree2IsVisible = projekteTabs.includes('tree2')
    const daten2IsVisible = projekteTabs.includes('daten2')
    const filter2IsVisible = projekteTabs.includes('filter2')
    const karte2IsVisible = projekteTabs.includes('karte2')

    const widths = useMemo(
      () => [
        134,
        83,
        77,
        77,
        ...(!!projId ? [95] : []),
        ...(showAllMenus ? [147, 92, 88] : []),
        ...(showAllMenus && !!projId ? [101] : []),
        129,
        71,
      ],
      [],
    )

    return (
      <MenuBar
        widths={widths}
        rerenderer={`${projId}/${showAllMenus}/${projekteTabs}`}
      >
        <StyledButton
          name="tree"
          variant={treeIsVisible ? 'outlined' : 'text'}
          followed={datenIsVisible?.toString()}
          onClick={onClickTree}
          data-id="nav-tree1"
          width={134}
        >
          Strukturbaum
        </StyledButton>
        <Daten />
        <StyledButton
          variant={filterIsVisible ? 'outlined' : 'text'}
          preceded={datenIsVisible?.toString()}
          followed={karteIsVisible?.toString()}
          onClick={onClickFilter}
          data-id="nav-filter1"
          title="Daten filtern"
          width={77}
        >
          Filter
        </StyledButton>
        <StyledButton
          variant={karteIsVisible ? 'outlined' : 'text'}
          preceded={filterIsVisible?.toString()}
          followed={(
            (!!projId && exporteIsVisible) ||
            (showAllMenus && !projId && tree2IsVisible)
          )?.toString()}
          onClick={onClickKarte}
          data-id="nav-karte1"
          width={77}
        >
          Karte
        </StyledButton>
        {!!projId && (
          <StyledButton
            variant={exporteIsVisible ? 'outlined' : 'text'}
            preceded={karteIsVisible?.toString()}
            followed={(showAllMenus && tree2IsVisible)?.toString()}
            onClick={onClickExporte}
            data-id="nav-exporte"
            width={95}
          >
            Exporte
          </StyledButton>
        )}
        {showAllMenus && (
          <StyledDesktopButton
            variant={tree2IsVisible ? 'outlined' : 'text'}
            preceded={(
              (!!projId && exporteIsVisible) ||
              (!projId && karteIsVisible)
            )?.toString()}
            followed={daten2IsVisible?.toString()}
            onClick={onClickTree2}
            data-id="nav-tree2"
            width={147}
            hide={(!showAllMenus).toString()}
          >
            Strukturbaum 2
          </StyledDesktopButton>
        )}
        {showAllMenus && tree2IsVisible && <Daten treeNr="2" />}
        {showAllMenus && tree2IsVisible && (
          <StyledDesktopButton
            variant={filter2IsVisible ? 'outlined' : 'text'}
            preceded={daten2IsVisible?.toString()}
            followed={karte2IsVisible?.toString()}
            onClick={onClickFilter2}
            data-id="nav-filter2"
            title="Daten filtern"
            width={88}
            hide={(!showAllMenus).toString()}
          >
            Filter 2
          </StyledDesktopButton>
        )}
        {showAllMenus && !!projId && (
          <StyledDesktopButton
            variant="text"
            preceded={false?.toString()}
            followed={false.toString()}
            component={Link}
            to={`/Daten/Projekte/${projId}/EK-Planung${search}`}
            data-id="ek-planung"
            title="EK und EKF planen"
            width={101}
            hide={(!showAllMenus).toString()}
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
      </MenuBar>
    )
  }),
)
