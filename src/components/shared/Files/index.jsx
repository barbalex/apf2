import {
  useCallback,
  useState,
  useRef,
  useContext,
  memo,
  useMemo,
  Suspense,
} from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SimpleBar from 'simplebar-react'
import {
  FaPlus,
  FaMinus,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
  FaMaximize,
  FaMinimize,
} from 'react-icons/fa6'
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom'

import './index.css'

import { ErrorBoundary } from '../ErrorBoundary.jsx'
import { Error } from '../Error'
import { Spinner } from '../Spinner'
import { MenuBar } from '../MenuBar/index.jsx'

import {
  apFile as apFileFragment,
  idealbiotopFile as idealbiotopFileFragment,
  popFile as popFileFragment,
  tpopFile as tpopFileFragment,
  tpopkontrFile as tpopkontrFileFragment,
  tpopmassnFile as tpopmassnFileFragment,
} from '../fragments'
import { Uploader } from '../Uploader/index.jsx'
import { UploaderContext } from '../../../UploaderContext.js'
import { File } from './Files/File.jsx'
import { isImageFile } from './isImageFile.js'
import { StoreContext } from '../../../storeContext.js'
import { icon } from 'leaflet'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`
const OutletContainer = styled.div`
  flex-grow: 1;
`
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

const fragmentObject = {
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

export const FilesRouter = memo(
  observer(({ parentId = '99999999-9999-9999-9999-999999999999', parent }) => {
    // console.log('FilesRouter', { parentId, parent })
    const store = useContext(StoreContext)
    const { fileId } = useParams()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const isPreview = pathname.endsWith('Vorschau')
    const client = useApolloClient()
    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()
    const infoUuidsProcessed = useRef([])

    const containerRef = useRef(null)

    const queryName = `all${upperFirst(parent)}Files`
    const parentIdName = `${parent}Id`
    const fields = `${upperFirst(parent)}FileFields`
    const fragment = fragmentObject[parent]

    const query = gql`
        query FileQuery($parentId: UUID!) {
          ${queryName}(
            orderBy: NAME_ASC
            filter: { ${parentIdName}: { equalTo: $parentId } }
          ) {
            nodes {
              ...${fields}
            }
          }
        }
        ${fragment}
      `
    const { data, error, isLoading, refetch } = useQuery({
      queryKey: ['FileQuery', parentId],
      queryFn: () =>
        client.query({
          query,
          variables: { parentId },
          fetchPolicy: 'no-cache',
        }),
    })

    const files = data?.data?.[`all${upperFirst(parent)}Files`].nodes ?? []

    console.log('FilesRouter', { files })

    const onCommonUploadSuccess = useCallback(
      async (info) => {
        // reset infoUuidsProcessed
        infoUuidsProcessed.current = []
        // close the uploader or it will be open when navigating to the list
        api?.doneFlow?.()
        // clear the uploader or it will show the last uploaded file when opened next time
        api?.removeAllFiles?.()
        // somehow this needs to be delayed or sometimes not all files will be uploaded
        setTimeout(() => refetch(), 500)
      },
      [client, fields, fragment, parent, parentId, refetch],
    )

    // ISSUE: sometimes this is called multiple times with the same info.uuid
    const onFileUploadSuccess = useCallback(
      async (info) => {
        if (info) {
          if (infoUuidsProcessed.current.includes(info.uuid)) return
          infoUuidsProcessed.current.push(info.uuid)
          let responce
          try {
            responce = await client.mutate({
              mutation: gql`
              mutation insertFile {
                create${upperFirst(parent)}File(
                  input: {
                    ${parent}File: {
                      fileId: "${info.uuid}",
                      fileMimeType: "${info.mimeType}",
                      ${parent}Id: "${parentId}",
                      name: "${info.name}"
                    }
                  }
                ) {
                  ${parent}File {
                    ...${fields}
                  }
                }
              }
              ${fragment}
            `,
            })
          } catch (error) {
            console.log(error)
            store.enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            })
          }
          // console.log('FilesRouter.onFileUploadSuccess', { info, responce })
        }
      },
      [client, fields, fragment, parent, parentId, refetch],
    )

    const onFileUploadFailed = useCallback((error) => {
      console.error('Upload failed:', error)
      store.enqueNotification({
        message: error?.message ?? 'Upload fehlgeschlagen',
        options: {
          variant: 'error',
        },
      })
      // close the uploader or it will be open when navigating to the list
      api?.doneFlow?.()
      // clear the uploader or it will show the last uploaded file when opened next time
      api?.removeAllFiles?.()
      // somehow this needs to be delayed or sometimes not all files will be uploaded
      setTimeout(() => refetch(), 500)
    }, [])

    const firstFileId = files?.[0]?.fileId

    const onClickPreview = useCallback(
      () => navigate(`${firstFileId}/Vorschau`),
      [firstFileId],
    )
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
      const file = files[index]
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
      navigate(nextPathname)
      // TODO: works but when navigating to file list, that has not been updated
      store.queryClient.invalidateQueries({
        queryKey: ['FileQuery'],
      })
    }, [fileId, files, client, parent, pathname])

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
          <Menu
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
          </Menu>
        </div>,
        <IconButton
          key="vorige_datei"
          title="vorige Datei"
          onClick={() => {
            console.log('TODO: navigate. How to know which file?')
          }}
        >
          <FaChevronLeft />
        </IconButton>,
        <IconButton
          key="naechste_datei"
          title="nächste Datei"
          onClick={() => {
            console.log('TODO: navigate. How to know which file?')
          }}
        >
          <FaChevronRight />
        </IconButton>,
      ],
      [onClickClosePreview, delMenuOpen, delMenuAnchorEl, onClickDelete],
    )

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <Container ref={containerRef}>
          <Uploader
            onFileUploadSuccess={onFileUploadSuccess}
            onFileUploadFailed={onFileUploadFailed}
            onCommonUploadSuccess={onCommonUploadSuccess}
          />
          <MenuBar>{isPreview ? previewMenus : menus}</MenuBar>
          <OutletContainer>
            <Suspense fallback={<Spinner />}>
              <Outlet
                context={{ files, parent, parentId, refetch, containerRef }}
              />
            </Suspense>
          </OutletContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
