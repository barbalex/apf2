import {
  useCallback,
  useState,
  useContext,
  memo,
  useMemo,
  useEffect,
} from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  FaPlus,
  FaMinus,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaMaximize,
  FaMinimize,
  FaDownload,
} from 'react-icons/fa6'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import screenfull from 'screenfull'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'
import { MenuBar } from '../../MenuBar/index.jsx'
import { Title } from './Title.jsx'
import { UploaderContext } from '../../../../UploaderContext.js'
import { StoreContext } from '../../../../storeContext.js'

const MenuTitle = styled.h3`
  padding-top: 8px;
  padding-left: 15px;
  padding-right: 16px;
  padding-bottom: 0;
  margin-bottom: 3px;
  &:focus {
    outline: none;
  }
`

export const Menu = memo(
  observer(({ parent, files, refetch, containerRef }) => {
    const store = useContext(StoreContext)
    const { fileId } = useParams()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const isPreview = pathname.endsWith('Vorschau')
    const client = useApolloClient()
    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()

    const firstFileId = files?.[0]?.fileId
    const file = files.find((f) => f.fileId === fileId)

    const onClickPreview = useCallback(() => {
      navigate(`${firstFileId}/Vorschau`)
    }, [firstFileId])
    const onClickClosePreview = useCallback(() => {
      // relative navigation using ../.. does not work here
      const fileIdBeginsAt = pathname.indexOf(fileId)
      const newPathname = pathname.slice(0, fileIdBeginsAt)
      navigate(newPathname)
    }, [pathname, fileId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)
    const onClickDelete = useCallback(async () => {
      const indexOfFileInPathname = pathname.indexOf(fileId)
      // delete file with fileId
      // first get fileId of next file to navigate to it after deleting this one
      // get index of current file in files
      const index = files.findIndex((file) => file.fileId === fileId)
      // get file to navigate to after deleting this one
      const nextFile = files[index + 1]
      const prevFile = files[index - 1]
      const nextPathname =
        nextFile ?
          `${pathname.slice(0, indexOfFileInPathname)}${nextFile.fileId}/Vorschau`
        : prevFile ?
          `${pathname.slice(0, indexOfFileInPathname)}${prevFile.fileId}/Vorschau`
        : pathname.slice(0, indexOfFileInPathname)
      try {
        const tableName = `${parent}File`
        const mutationName = `delete${upperFirst(parent)}FileById`
        await client.mutate({
          mutation: gql`
          mutation deleteDataset {
            ${mutationName}(
              input: {
                id: "${file.id}"
              }
            ) {
              ${tableName} {
                id
              }
            }
          }
        `,
        })
      } catch (error) {
        console.log(error)
        return store.enqueNotification({
          message: `Die Datei konnte nicht gelöscht werden: ${error.message}`,
          options: {
            variant: 'error',
          },
        })
      }
      setDelMenuAnchorEl(null)
      refetch()
      navigate(nextPathname)
    }, [fileId, files, client, parent, pathname])

    const onClickNext = useCallback(() => {
      // get index of current file in files
      const index = files.findIndex((file) => file.fileId === fileId)
      // get file to navigate to
      const nextFile = files[index + 1] ?? files[0]
      navigate(`${nextFile.fileId}/Vorschau`)
    }, [fileId, files, navigate])

    const onClickPrev = useCallback(() => {
      // get index of current file in files
      const index = files.findIndex((file) => file.fileId === fileId)
      // get file to navigate to
      const prevFile = files[index - 1] ?? files[files.length - 1]
      navigate(`${prevFile.fileId}/Vorschau`)
    }, [fileId, files, navigate])

    // enable reacting to fullscreen changes
    const [isFullscreen, setIsFullscreen] = useState(false)
    useEffect(() => {
      screenfull.on('change', () => setIsFullscreen(screenfull.isFullscreen))
      return () => screenfull.off('change')
    }, [])

    const onClickDownload = useCallback(
      () => window.open(`https://ucarecdn.com/${fileId}/-/inline/no/`),
      [fileId],
    )

    // BEWARE: functions passed into menus do not react to state changes
    // unless they are added to the dependencies array
    const menus = useMemo(
      () => [
        <IconButton
          key="vorschau_oeffnen"
          title="Vorschau öffnen"
          onClick={onClickPreview}
          disabled={!firstFileId}
        >
          <FaEye />
        </IconButton>,
        <IconButton
          key="dateien_hochladen"
          title="Dateien hochladen"
          onClick={api?.initFlow}
        >
          <FaPlus />
        </IconButton>,
      ],
      [onClickPreview],
    )
    const previewMenus = useMemo(
      () => [
        <IconButton
          key="vorschau_schliessen"
          title="Vorschau schliessen"
          onClick={onClickClosePreview}
        >
          <FaEyeSlash />
        </IconButton>,
        ...[
          screenfull.isEnabled ?
            <IconButton
              key="minimieren"
              title={isFullscreen ? 'minimieren' : 'maximieren'}
              onClick={() => screenfull.toggle(containerRef.current)}
            >
              {isFullscreen ?
                <FaMinimize />
              : <FaMaximize />}
            </IconButton>
          : [],
        ],
        <IconButton
          key="download"
          title="herunterladen"
          onClick={onClickDownload}
        >
          <FaDownload />
        </IconButton>,
        <IconButton
          key="dateien_hochladen"
          title="Dateien hochladen"
          onClick={api?.initFlow}
        >
          <FaPlus />
        </IconButton>,
        <div
          key="loeschen"
          style={{ display: 'inline' }}
        >
          <IconButton
            title="löschen"
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'previewDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
          <MuiMenu
            id="previewDelMenu"
            anchorEl={delMenuAnchorEl}
            open={delMenuOpen}
            onClose={() => setDelMenuAnchorEl(null)}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: 120,
              },
            }}
          >
            <MenuTitle>löschen?</MenuTitle>
            <MenuItem onClick={onClickDelete}>ja</MenuItem>
            <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
          </MuiMenu>
        </div>,
        <IconButton
          key="vorige_datei"
          title="vorige Datei"
          onClick={onClickPrev}
        >
          <FaChevronLeft />
        </IconButton>,
        <IconButton
          key="naechste_datei"
          title="nächste Datei"
          onClick={onClickNext}
        >
          <FaChevronRight />
        </IconButton>,
      ],
      [
        onClickClosePreview,
        delMenuOpen,
        delMenuAnchorEl,
        onClickDelete,
        onClickNext,
        onClickPrev,
        isFullscreen,
        screenfull.isEnabled,
        isPreview,
      ],
    )

    return (
      <ErrorBoundary>
        <MenuBar
          isPreview={isPreview}
          file={file}
          titleComponent={<Title file={file} />}
        >
          {isPreview ? previewMenus : menus}
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
