import { useCallback, useState, useContext, memo, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import upperFirst from 'lodash/upperFirst'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import {
  FaPlus,
  FaMinus,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaMaximize,
  FaMinimize,
  FaDownload,
} from 'react-icons/fa6'
import { useNavigate, useLocation, useParams } from 'react-router'
import screenfull from 'screenfull'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'
import { UploaderContext } from '../../../../UploaderContext.js'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from './index.jsx'

export const PreviewMenus = memo(
  observer(({ parent, files, refetch, containerRef }) => {
    const store = useContext(StoreContext)
    const { fileId } = useParams()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const client = useApolloClient()
    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()

    const file = files.find((f) => f.fileId === fileId)
    const fileIndex = files.findIndex((f) => f.fileId === fileId)

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
      // get file to navigate to after deleting this one
      const nextFile = files[fileIndex + 1]
      const prevFile = files[fileIndex - 1]
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
    }, [
      fileId,
      files,
      client,
      parent,
      pathname,
      fileIndex,
      refetch,
      store,
      navigate,
    ])

    const onClickNext = useCallback(() => {
      const nextFileIndex = fileIndex + 1
      const nextFile = files[nextFileIndex] ?? files[0]
      console.log('Files.Menu.onClickNext', {
        fileId,
        nextFileId: nextFile.fileId,
        fileIndex,
        nextFileIndex,
        files,
      })
      navigate(`${nextFile.fileId}/Vorschau`)
    }, [fileIndex, files, fileId, navigate])

    const onClickPrev = useCallback(() => {
      const prevFile = files[fileIndex - 1] ?? files[files.length - 1]
      navigate(`${prevFile.fileId}/Vorschau`)
    }, [fileId, files, navigate, fileIndex])

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

    return (
      <ErrorBoundary>
        <Tooltip
          key="vorschau_schliessen"
          title="Vorschau schliessen"
        >
          <IconButton onClick={onClickClosePreview}>
            <FaEyeSlash />
          </IconButton>
        </Tooltip>
        {screenfull.isEnabled && (
          <Tooltip
            key="minimieren"
            title={isFullscreen ? 'minimieren' : 'maximieren'}
          >
            <IconButton onClick={() => screenfull.toggle(containerRef.current)}>
              {isFullscreen ?
                <FaMinimize />
              : <FaMaximize />}
            </IconButton>
          </Tooltip>
        )}
        <Tooltip
          key="download"
          title="herunterladen"
        >
          <IconButton onClick={onClickDownload}>
            <FaDownload />
          </IconButton>
        </Tooltip>
        <Tooltip
          key="dateien_hochladen"
          title="Dateien hochladen"
        >
          <IconButton onClick={api?.initFlow}>
            <FaPlus />
          </IconButton>
        </Tooltip>
        <Tooltip
          key="loeschen"
          title="löschen"
          style={{ display: 'inline' }}
        >
          <IconButton
            onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
            aria-owns={delMenuOpen ? 'previewDelMenu' : undefined}
          >
            <FaMinus />
          </IconButton>
        </Tooltip>
        <Tooltip
          key="vorige_datei"
          title="vorige Datei"
        >
          <IconButton onClick={onClickPrev}>
            <FaChevronLeft />
          </IconButton>
        </Tooltip>
        <Tooltip
          key="naechste_datei"
          title="nächste Datei"
        >
          <IconButton onClick={onClickNext}>
            <FaChevronRight />
          </IconButton>
        </Tooltip>
        <MuiMenu
          id="previewDelMenu"
          anchorEl={delMenuAnchorEl}
          open={delMenuOpen}
          onClose={() => setDelMenuAnchorEl(null)}
        >
          <MenuTitle>löschen?</MenuTitle>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }),
)
