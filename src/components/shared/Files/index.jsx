import { useCallback, useState, useRef, useContext, memo, useMemo } from 'react'
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
import { File } from './File.jsx'
import { isImageFile } from './isImageFile.js'
import { StoreContext } from '../../../storeContext.js'
import { icon } from 'leaflet'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
  padding: 0 10px;
`
const Spacer = styled.div`
  height: 10px;
`
const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 8px;
`
const LightboxButton = styled(Button)`
  margin-left: 10px !important;
  text-transform: none !important;
`

const fragmentObject = {
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

export const Files = memo(
  observer(
    ({
      parentId = '99999999-9999-9999-9999-999999999999',
      parent,
      loadingParent, // still in use?
    }) => {
      const client = useApolloClient()
      const uploaderCtx = useContext(UploaderContext)
      const api = uploaderCtx?.current?.getAPI?.()
      const storeContext = useContext(StoreContext)

      const [isPreview, setIsPreview] = useState(false)

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
          console.log('onCommonUploadSuccess', info)
          // close the uploader or it will be open when navigating to the list
          api?.doneFlow?.()
          // clear the uploader or it will show the last uploaded file when opened next time
          api?.removeAllFiles?.()
          // somehow this needs to be delayed or sometimes not all files will be uploaded
          setTimeout(() => refetch(), 500)
        },
        [client, fields, fragment, parent, parentId, refetch],
      )

      const onFileUploadSuccess = useCallback(
        async (info) => {
          console.log('onFileUploadSuccess', info)
          if (info) {
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

      const setPreview = useCallback(() => setIsPreview(true), [setIsPreview])
      const unsetPreview = useCallback(
        () => setIsPreview(false),
        [setIsPreview],
      )

      // BEWARE: functions passed into menus do not react to state changes
      const menus = useMemo(
        () => [
          <IconButton
            key="vorschau_oeffnen"
            title="Vorschau öffnen"
            onClick={setPreview}
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
        [],
      )
      const previewMenus = useMemo(
        () => [
          <IconButton
            key="vorschau_schliessen"
            title="Vorschau schliessen"
            onClick={unsetPreview}
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
        [],
      )
      const allMenus = useMemo(
        () => (isPreview ? [...menus, ...previewMenus] : menus),
        [isPreview, menus, previewMenus],
      )

      if (loading || loadingParent) return <Spinner />

      if (error) return <Error error={error} />

      return (
        <OuterContainer>
          <MenuBar>{isPreview ? previewMenus : menus}</MenuBar>
          <SimpleBar
            style={{
              maxHeight: '100%',
              height: '100%',
            }}
            tabIndex={-1}
          >
            <ErrorBoundary>
              <Container>
                <ButtonsContainer>
                  <Uploader
                    onFileUploadSuccess={onFileUploadSuccess}
                    onFileUploadFailed={onFileUploadFailed}
                    onCommonUploadSuccess={onCommonUploadSuccess}
                  />
                </ButtonsContainer>
                <Spacer />
                {files.map((file) => (
                  <File
                    key={file.fileId}
                    file={file}
                    parent={parent}
                    refetch={refetch}
                  />
                ))}
              </Container>
            </ErrorBoundary>
          </SimpleBar>
        </OuterContainer>
      )
    },
  ),
)
