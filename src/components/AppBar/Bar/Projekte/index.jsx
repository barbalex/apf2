import { useContext } from 'react'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { remove } from 'es-toolkit'
import styled from '@emotion/styled'
import { jwtDecode } from 'jwt-decode'
import { observer } from 'mobx-react-lite'
import { Link, useParams, useLocation, useNavigate } from 'react-router'
import { useAtom } from 'jotai'
import { MdFilterAlt, MdInfoOutline, MdEditNote } from 'react-icons/md'
import { FaDownload } from 'react-icons/fa6'
import { VscListTree } from 'react-icons/vsc'
import { TbMap2 } from 'react-icons/tb'

import { More } from './More/index.jsx'
import { Daten } from './Daten.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.js'
import { MenuBar } from '../../../shared/MenuBar/index.jsx'
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
  text-wrap: none;
  // prevent text from breaking into multiple lines
  flex-shrink: 0;
  flex-grow: 0;
`
export const StyledIconButton = styled(Button)`
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
  border-radius: 4px !important;
  flex-shrink: 0;
  flex-grow: 0;
  // icon specific
  align-self: stretch;
  margin: 2px 0;
  padding: 5px 10px;
  font-size: 1.5em;
  min-width: unset !important;
`
const DokuButton = styled(Button)`
  color: white !important;
  text-transform: none !important;
  flex-shrink: 0;
  flex-grow: 0;
  text-transform: none !important;
  text-wrap: none;
`

export const ProjekteMenus = observer(() => {
  const { projId } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

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

  const onClickButton = (name) => {
    if (isMobileView) {
      // show one tab only
      if (projekteTabs.length === 1) {
        setProjekteTabs([name])
      } else {
        // if multiple tabs are visible, close the clicked one
        // UNLESS the clicked one was not yet visible - then open it and close non tree ones
        if (projekteTabs.includes(name)) {
          setProjekteTabs([...projekteTabs.filter((el) => el !== name)])
        } else {
          setProjekteTabs([...projekteTabs.filter((el) => el === 'tree'), name])
        }
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
  }

  const onClickTree = () => onClickButton('tree')
  const onClickKarte = () => onClickButton('karte')
  const onClickFilter = () => onClickButton('filter')
  const onClickFilter2 = () => onClickButton('filter2')

  // need to not use Link in AppBar because:
  // long press on mobile opens context menu AND tooltip...
  const onClickDocs = () => navigate(`/Dokumentation/${search}`)

  const onClickEkPlanung = () =>
    navigate(`/Daten/Projekte/${projId}/EK-Planung${search}`)

  const onClickExporte = () => onClickButton('exporte')

  const onClickTree2 = () => {
    resetTree2Src()
    onClickButton('tree2')
  }

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
        <Tooltip title="Navigationsbaum anzeigen">
          <StyledButton
            variant={treeIsVisible ? 'outlined' : 'text'}
            followed={datenIsVisible?.toString()}
            onClick={onClickTree}
            data-id="nav-tree1"
            width={150}
          >
            Navigationsbaum
          </StyledButton>
        </Tooltip>
      )}
      {/* in mobile view: only show if user did not decide to always show */}
      {/* do not hide if tree is visible - user can't close it! */}
      {isMobileView && (!hideTree || treeIsVisible) && (
        <Tooltip title="Navigationsbaum anzeigen">
          <StyledIconButton
            variant={treeIsVisible ? 'outlined' : 'text'}
            followed={datenIsVisible?.toString()}
            onClick={onClickTree}
            data-id="nav-tree1"
            width={46}
          >
            <VscListTree />
          </StyledIconButton>
        </Tooltip>
      )}
      <Daten width={77} />
      <Tooltip title="Daten filtern">
        {isDesktopView ?
          <StyledButton
            variant={filterIsVisible ? 'outlined' : 'text'}
            preceded={datenIsVisible?.toString()}
            followed={karteIsVisible?.toString()}
            onClick={onClickFilter}
            data-id="nav-filter1"
            width={70}
          >
            Filter
          </StyledButton>
        : <StyledIconButton
            variant={filterIsVisible ? 'outlined' : 'text'}
            onClick={onClickFilter}
            data-id="nav-filter1"
            width={46}
          >
            <MdFilterAlt />
          </StyledIconButton>
        }
      </Tooltip>
      <Tooltip title="Karte anzeigen">
        {isDesktopView ?
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
        : <StyledIconButton
            variant={karteIsVisible ? 'outlined' : 'text'}
            onClick={onClickKarte}
            data-id="nav-karte1"
            width={46}
          >
            <TbMap2 />
          </StyledIconButton>
        }
      </Tooltip>
      {!!projId && (
        <Tooltip title="Exporte anzeigen">
          {isDesktopView ?
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
          : <StyledIconButton
              variant={exporteIsVisible ? 'outlined' : 'text'}
              onClick={onClickExporte}
              data-id="nav-exporte"
              width={46}
            >
              <FaDownload />
            </StyledIconButton>
          }
        </Tooltip>
      )}
      {(isDesktopView || tree2IsVisible) && (
        <Tooltip title="Navigationsbaum 2 anzeigen">
          <StyledButton
            variant={tree2IsVisible ? 'outlined' : 'text'}
            preceded={(
              (!!projId && exporteIsVisible) ||
              (!projId && karteIsVisible)
            )?.toString()}
            followed={daten2IsVisible?.toString()}
            onClick={onClickTree2}
            data-id="nav-tree2"
            width={165}
          >
            Navigationsbaum 2
          </StyledButton>
        </Tooltip>
      )}
      {((isDesktopView && tree2IsVisible) || daten2IsVisible) && (
        <Daten
          treeNr="2"
          width={73}
        />
      )}
      {((isDesktopView && tree2IsVisible) || filter2IsVisible) && (
        <Tooltip title="Daten filtern">
          <StyledButton
            variant={filter2IsVisible ? 'outlined' : 'text'}
            preceded={daten2IsVisible?.toString()}
            followed={karte2IsVisible?.toString()}
            onClick={onClickFilter2}
            data-id="nav-filter2"
            width={70}
          >
            Filter 2
          </StyledButton>
        </Tooltip>
      )}
      {isDesktopView && !!projId && (
        <Tooltip title="EK und EKF planen">
          <StyledButton
            variant="text"
            preceded={false?.toString()}
            followed={false.toString()}
            onClick={onClickEkPlanung}
            width={101}
          >
            EK-Planung
          </StyledButton>
        </Tooltip>
      )}
      <Tooltip title="Dokumentation anzeigen">
        {isDesktopView ?
          <DokuButton
            variant="text"
            onClick={onClickDocs}
            width={129}
          >
            Dokumentation
          </DokuButton>
        : <StyledIconButton
            variant="text"
            onClick={onClickDocs}
            width={46}
          >
            <MdInfoOutline />
          </StyledIconButton>
        }
      </Tooltip>
      <More
        onClickExporte={onClickExporte}
        role={role}
        width={70}
      />
    </MenuBar>
  )
})
