import { useState, useContext, useEffect } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { useSetAtom } from 'jotai'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
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
import type { FileNode, FileParent } from '../types.ts'

import styles from './index.module.css'

import {
  addNotificationAtom,
} from '../../../../store/index.ts'


export interface PreviewMenusProps {
  parent: FileParent
  files: FileNode[]
  refetch: () => void
  containerRef: RefObject<HTMLDivElement | null>
}

export const PreviewMenus = ({ parent, files, refetch, containerRef }: PreviewMenusProps) => {
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
      if (!fileId) return
      // relative navigation using ../.. does not work here
      const fileIdBeginsAt = pathname.indexOf(fileId)
      const newPathname = pathname.slice(0, fileIdBeginsAt)
      void navigate(`${newPathname}${search}`)
    }

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = async () => {
      if (!fileId) return
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
          mutation: dynamicGql`
          mutation deleteDataset {
            ${mutationName}(
              input: {
                id: "${file?.id}"
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
          message: `Die Datei konnte nicht gelöscht werden: ${(error as Error).message}`,
          options: {
            variant: 'error',
          },
        })
      }
      setDelMenuAnchorEl(null)
      void refetch()
      void navigate(`${nextPathname}${search}`)
    }

    const onClickNext = () => {
      const nextFileIndex = fileIndex + 1
      const nextFile = files[nextFileIndex] ?? files[0]
      if (!nextFile) return
      void navigate(`${nextFile.fileId}/Vorschau${search}`)
    }

    const onClickPrev = () => {
      const prevFile = files[fileIndex - 1] ?? files[files.length - 1]
      if (!prevFile) return
      void navigate(`${prevFile.fileId}/Vorschau${search}`)
    }

    // enable reacting to fullscreen changes
    const [isFullscreen, setIsFullscreen] = useState(false)
    useEffect(() => {
      const onChange = () => setIsFullscreen(screenfull.isFullscreen)
      screenfull.on('change', onChange)
      return () => screenfull.off('change', onChange)
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
            <IconButton
              onClick={() => void screenfull.toggle(containerRef.current ?? undefined)}
            >
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
          <IconButton onClick={() => api?.initFlow()}>
            <FaPlus />
          </IconButton>
        </Tooltip>
        <Tooltip
          key="loeschen"
          title="löschen"
          style={{ display: 'inline' }}
        >
          <IconButton
            onClick={(event: MouseEvent<HTMLButtonElement>) =>
              setDelMenuAnchorEl(event.currentTarget as HTMLElement)
            }
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
          <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
          <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
        </MuiMenu>
      </ErrorBoundary>
    )
  }
