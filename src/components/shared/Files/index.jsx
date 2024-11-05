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
import { useApolloClient, useQuery, gql } from '@apollo/client'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import SimpleBar from 'simplebar-react'
import {
  FaPlus,
  FaMinus,
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
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

    const { data, error, loading, refetch } = useQuery(query, {
      variables: { parentId },
    })

    const files = data?.[`all${upperFirst(parent)}Files`].nodes ?? []

    const onCommonUploadSuccess = useCallback(
      async (info) => {
        // reset infiUuidsProcessed
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
          console.log('FilesRouter.onFileUploadSuccess', { info, responce })
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

    // BEWARE: functions passed into menus do not react to state changes
    // unless they are added to the dependencies array
    const menus = useMemo(
      () => [
        <IconButton
          key="vorschau_oeffnen"
          title="Vorschau öffnen"
          onClick={onClickPreview}
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
        <IconButton
          key="loeschen"
          title="löschen"
          onClick={() => {
            console.log('TODO: delete. How to know which file?')
          }}
        >
          <FaMinus />
        </IconButton>,
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
      [onClickClosePreview],
    )

    if (loading) return <Spinner />

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
