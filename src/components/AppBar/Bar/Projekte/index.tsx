import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { remove } from 'es-toolkit'
import { jwtDecode } from 'jwt-decode'
import { Link, useParams, useLocation, useNavigate } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import { MdFilterAlt, MdInfoOutline, MdEditNote } from 'react-icons/md'
import { FaDownload } from 'react-icons/fa6'
import { VscListTree } from 'react-icons/vsc'
import { TbMap2 } from 'react-icons/tb'

import { More } from './More/index.tsx'
import { Daten } from './Daten.tsx'
import { useProjekteTabs } from '../../../../modules/useProjekteTabs.ts'
import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import {
  isDesktopViewAtom,
  hideTreeAtom,
  userTokenAtom,
  resetTree2SrcAtom,
} from '../../../../store/index.ts'

import styles from './index.module.css'

export const ProjekteMenus = () => {
  const { projId } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

  const isDesktopView = useAtomValue(isDesktopViewAtom)
  const isMobileView = !isDesktopView

  const hideTree = useAtomValue(hideTreeAtom)

  const resetTree2Src = useSetAtom(resetTree2SrcAtom)

  const token = useAtomValue(userTokenAtom)
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null

  const [projekteTabs, setProjekteTabs] = useProjekteTabs()

  const onClickButton = (name) => {
    if (isMobileView) {
      // show one tab only
      if (projekteTabs.length === 1) {
        return setProjekteTabs([name])
      } else {
        // if multiple tabs are visible, close the clicked one
        // UNLESS the clicked one was not yet visible - then open it and close non tree ones
        if (projekteTabs.includes(name)) {
          return setProjekteTabs([...projekteTabs.filter((el) => el !== name)])
        }
        return setProjekteTabs([
          ...projekteTabs.filter((el) => el === 'tree'),
          name,
        ])
      }
    }
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
          <Button
            variant={treeIsVisible ? 'outlined' : 'text'}
            onClick={onClickTree}
            data-id="nav-tree1"
            width={150}
            className={`${styles.button} ${datenIsVisible ? styles.followed : ''}`}
          >
            Navigationsbaum
          </Button>
        </Tooltip>
      )}
      {/* in mobile view: only show if user did not decide to always show */}
      {/* do not hide if tree is visible - user can't close it! */}
      {isMobileView && (!hideTree || treeIsVisible) && (
        <Tooltip title="Navigationsbaum anzeigen">
          <Button
            variant={treeIsVisible ? 'outlined' : 'text'}
            onClick={onClickTree}
            data-id="nav-tree1"
            width={46}
            className={styles.iconButton}
          >
            <VscListTree />
          </Button>
        </Tooltip>
      )}
      <Daten width={77} />
      <Tooltip title="Daten filtern">
        {isDesktopView ?
          <Button
            variant={filterIsVisible ? 'outlined' : 'text'}
            onClick={onClickFilter}
            data-id="nav-filter1"
            width={70}
            className={`${styles.button} ${datenIsVisible ? styles.preceded : ''} ${karteIsVisible ? styles.followed : ''}`}
          >
            Filter
          </Button>
        : <Button
            variant={filterIsVisible ? 'outlined' : 'text'}
            onClick={onClickFilter}
            data-id="nav-filter1"
            width={46}
            className={styles.iconButton}
          >
            <MdFilterAlt />
          </Button>
        }
      </Tooltip>
      <Tooltip title="Karte anzeigen">
        {isDesktopView ?
          <Button
            variant={karteIsVisible ? 'outlined' : 'text'}
            onClick={onClickKarte}
            data-id="nav-karte1"
            width={70}
            className={`${styles.button} ${filterIsVisible ? styles.preceded : ''} ${
              (!!projId && exporteIsVisible) || (!projId && tree2IsVisible) ?
                styles.followed
              : ''
            }`}
          >
            Karte
          </Button>
        : <Button
            variant={karteIsVisible ? 'outlined' : 'text'}
            onClick={onClickKarte}
            data-id="nav-karte1"
            width={46}
            className={styles.iconButton}
          >
            <TbMap2 />
          </Button>
        }
      </Tooltip>
      {!!projId && (
        <Tooltip title="Exporte anzeigen">
          {isDesktopView ?
            <Button
              variant={exporteIsVisible ? 'outlined' : 'text'}
              onClick={onClickExporte}
              data-id="nav-exporte"
              width={74}
              className={`${styles.button} ${karteIsVisible ? styles.preceded : ''} ${
                isDesktopView && tree2IsVisible ? styles.followed : ''
              }`}
            >
              Exporte
            </Button>
          : <Button
              variant={exporteIsVisible ? 'outlined' : 'text'}
              onClick={onClickExporte}
              data-id="nav-exporte"
              width={46}
              className={styles.iconButton}
            >
              <FaDownload />
            </Button>
          }
        </Tooltip>
      )}
      {(isDesktopView || tree2IsVisible) && (
        <Tooltip title="Navigationsbaum 2 anzeigen">
          <Button
            variant={tree2IsVisible ? 'outlined' : 'text'}
            onClick={onClickTree2}
            data-id="nav-tree2"
            width={165}
            className={`${styles.button} ${
              (!!projId && exporteIsVisible) || (!projId && karteIsVisible) ?
                styles.preceded
              : ''
            } ${daten2IsVisible ? styles.followed : ''}`}
          >
            Navigationsbaum 2
          </Button>
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
          <Button
            variant={filter2IsVisible ? 'outlined' : 'text'}
            onClick={onClickFilter2}
            data-id="nav-filter2"
            width={70}
            className={`${styles.button} ${daten2IsVisible ? styles.preceded : ''} ${
              karte2IsVisible ? styles.followed : ''
            }`}
          >
            Filter 2
          </Button>
        </Tooltip>
      )}
      {isDesktopView && !!projId && (
        <Tooltip title="EK und EKF planen">
          <Button
            variant="text"
            onClick={onClickEkPlanung}
            width={101}
            className={styles.button}
          >
            EK-Planung
          </Button>
        </Tooltip>
      )}
      <Tooltip title="Dokumentation anzeigen">
        {isDesktopView ?
          <Button
            variant="text"
            onClick={onClickDocs}
            width={129}
            className={styles.dokuButton}
          >
            Dokumentation
          </Button>
        : <Button
            variant="text"
            onClick={onClickDocs}
            width={46}
            className={styles.iconButton}
          >
            <MdInfoOutline />
          </Button>
        }
      </Tooltip>
      <More
        onClickExporte={onClickExporte}
        role={role}
        width={70}
      />
    </MenuBar>
  )
}
