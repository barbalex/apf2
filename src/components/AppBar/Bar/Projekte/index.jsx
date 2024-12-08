import { memo, useContext, useCallback } from 'react'
import Button from '@mui/material/Button'
import remove from 'lodash/remove'
import styled from '@emotion/styled'
import { jwtDecode } from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link, useParams, useLocation } from 'react-router'
import { useAtom } from 'jotai'

import { More } from './More/index.jsx'
import { Daten } from './Daten.jsx'
import { MobxContext } from '../../../../storeContext.js'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { constants } from '../../../../modules/constants.js'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { hideTreeAtom } from '../../../../JotaiStore/index.js'

// getting widths of elements from refs
// BEWARE: ref.current is only set on first render
// if element is conditionally rendered and not visible on first render, ref.current will be null!!!
// Solution: instead of not rendering, set offscreen with transform: translateX(-9999px)
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
  ${(props) =>
    props.inmenu === 'true' && `border: 1px solid #ab9518 !important;`}
  text-wrap: none;
  // prevent text from breaking into multiple lines
  flex-shrink: 0;
  flex-grow: 0;
`
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  flex-shrink: 0;
  flex-grow: 0;
  text-transform: none !important;
  text-wrap: none;
  ${(props) =>
    props.inmenu === 'true' && `border: 1px solid #ab9518 !important;`};
`

export const ProjekteMenus = memo(
  observer(() => {
    const { projId } = useParams()
    const { search } = useLocation()

    const [isDesktopView] = useAtom(isDesktopViewAtom)
    const isMobileView = !isDesktopView

    const [hideTree] = useAtom(hideTreeAtom)

    const store = useContext(MobxContext)
    const { user } = store
    const { resetTree2Src } = store.tree

    const token = user?.token
    const tokenDecoded = token ? jwtDecode(token) : null
    const role = tokenDecoded ? tokenDecoded.role : null

    const [projekteTabs, setProjekteTabs] = useProjekteTabs()

    const onClickButton = useCallback(
      (name) => {
        if (isMobileView) {
          // show one tab only
          // if multiple tabs are visible, close the clicked one
          if (projekteTabs.length === 1) {
            setProjekteTabs([name])
          } else {
            setProjekteTabs([...projekteTabs.filter((el) => el !== name)])
          }
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
      [isMobileView, setProjekteTabs, projekteTabs],
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

    // ISSUE: refs are sometimes/often not set on first render
    // trying to measure widths of menus leads to complete chaos
    // so passing in static widths instead

    return (
      <MenuBar
        rerenderer={`${projId}/${isDesktopView}/${projekteTabs}`}
        bgColor="rgb(46, 125, 50)"
        addMargin={false}
      >
        {isDesktopView && (
          <StyledButton
            variant={treeIsVisible ? 'outlined' : 'text'}
            followed={datenIsVisible?.toString()}
            onClick={onClickTree}
            data-id="nav-tree1"
            width={134}
          >
            Strukturbaum
          </StyledButton>
        )}
        <Daten width={77} />
        <StyledButton
          variant={filterIsVisible ? 'outlined' : 'text'}
          preceded={datenIsVisible?.toString()}
          followed={karteIsVisible?.toString()}
          onClick={onClickFilter}
          data-id="nav-filter1"
          title="Daten filtern"
          width={70}
        >
          Filter
        </StyledButton>
        <StyledButton
          variant={karteIsVisible ? 'outlined' : 'text'}
          preceded={filterIsVisible?.toString()}
          followed={(
            (!!projId && exporteIsVisible) ||
            (isDesktopView && !projId && tree2IsVisible)
          )?.toString()}
          onClick={onClickKarte}
          data-id="nav-karte1"
          width={70}
        >
          Karte
        </StyledButton>
        {!!projId && (
          <StyledButton
            variant={exporteIsVisible ? 'outlined' : 'text'}
            preceded={karteIsVisible?.toString()}
            followed={(isDesktopView && tree2IsVisible)?.toString()}
            onClick={onClickExporte}
            data-id="nav-exporte"
            width={74}
          >
            Exporte
          </StyledButton>
        )}
        {(isDesktopView || tree2IsVisible) && (
          <StyledButton
            variant={tree2IsVisible ? 'outlined' : 'text'}
            preceded={(
              (!!projId && exporteIsVisible) ||
              (!projId && karteIsVisible)
            )?.toString()}
            followed={daten2IsVisible?.toString()}
            onClick={onClickTree2}
            data-id="nav-tree2"
            width={147}
          >
            Strukturbaum 2
          </StyledButton>
        )}
        {((isDesktopView && tree2IsVisible) || daten2IsVisible) && (
          <Daten
            treeNr="2"
            width={73}
          />
        )}
        {((isDesktopView && tree2IsVisible) || filter2IsVisible) && (
          <StyledButton
            variant={filter2IsVisible ? 'outlined' : 'text'}
            preceded={daten2IsVisible?.toString()}
            followed={karte2IsVisible?.toString()}
            onClick={onClickFilter2}
            data-id="nav-filter2"
            title="Daten filtern"
            width={70}
          >
            Filter 2
          </StyledButton>
        )}
        {isDesktopView && !!projId && (
          <StyledButton
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
          </StyledButton>
        )}
        <DokuButton
          variant="text"
          component={Link}
          to={`/Dokumentation/${search}`}
          width={129}
        >
          Dokumentation
        </DokuButton>
        {/* in mobile view: move tree to the end of the menus */}
        {/* only show if user did not decide to always show */}
        {/* do not hide if tree is visible - user can't close it! */}
        {isMobileView && (!hideTree || treeIsVisible) && (
          <StyledButton
            variant={treeIsVisible ? 'outlined' : 'text'}
            followed="false"
            onClick={onClickTree}
            data-id="nav-tree1"
            width={134}
          >
            Strukturbaum
          </StyledButton>
        )}
        <More
          onClickExporte={onClickExporte}
          role={role}
          width={70}
        />
      </MenuBar>
    )
  }),
)
