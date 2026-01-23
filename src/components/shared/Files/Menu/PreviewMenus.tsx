import { useState, useContext, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { upperFirst } from 'es-toolkit'
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

import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import { UploaderContext } from '../../../../UploaderContext.ts'

import styles from './index.module.css'

import {
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'


export const PreviewMenus =
  ({ parent, files, refetch, containerRef }) => {
  const addNotification = useSetAtom(addNotificationAtom)
    const { fileId } = useParams()
    const navigate = useNavigate()
    const { pathname, search } = useLocation()

    const apolloClient = useApolloClient()

    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()

    const file = files.find((f) => f.fileId === fileId)
    const fileIndex = files.findIndex((f) => f.fileId === fileId)

    const onClickClosePreview = () => {
      // relative navigation using ../.. does not work here
      const fileIdBeginsAt = pathname.indexOf(fileId)
      const newPathname = pathname.slice(0, fileIdBeginsAt)
      navigate(`${newPathname}${search}`)
    }

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = async () => {
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
        await apolloClient.mutate({
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
        return addNotification({
          message: `Die Datei konnte nicht gelöscht werden: ${error.message}`,
          options: {
            variant: 'error',
          },
        })
      }
      setDelMenuAnchorEl(null)
      refetch()
      navigate(`${nextPathname}${search}`)
    }

    const onClickNext = () => {
      const nextFileIndex = fileIndex + 1
      const nextFile = files[nextFileIndex] ?? files[0]
      navigate(`${nextFile.fileId}/Vorschau${search}`)
    }

    const onClickPrev = () => {
      const prevFile = files[fileIndex - 1] ?? files[files.length - 1]
      navigate(`${prevFile.fileId}/Vorschau${search}`)
    }

    // enable reacting to fullscreen changes
    const [isFullscreen, setIsFullscreen] = useState(false)
    useEffect(() => {
      screenfull.on('change', () => setIsFullscreen(screenfull.isFullscreen))
      return () => screenfull.off('change')
    }, [])

    const onClickDownload = () =>
      window.open(`https://ucarecdn.com/${fileId}/-/inline/no/`)

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
          <h3 className={styles.menuTitle}>löschen?</h3>
          <MenuItem onClick={onClickDelete}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }
