import { useCallback, useRef, useContext, memo, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import upperFirst from 'lodash/upperFirst'
import { useNavigate, Outlet, useParams } from 'react-router'

import './index.css'

import { ErrorBoundary } from '../ErrorBoundary.jsx'
import { Error } from '../Error.jsx'
import { Spinner } from '../Spinner.jsx'

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
import { MobxContext } from '../../../storeContext.js'
import { Menu } from './Menu/index.jsx'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`
const OutletContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    const store = useContext(MobxContext)
    const { fileId } = useParams()
    const navigate = useNavigate()
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
          // navigate to the new file
          const newFile =
            responce?.data?.[`create${upperFirst(parent)}File`]?.[
              `${parent}File`
            ]
          if (newFile) {
            navigate(`${newFile.fileId}/Vorschau`)
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
          <Menu
            parent={parent}
            files={files}
            refetch={refetch}
            containerRef={containerRef}
          />
          <OutletContainer>
            <Suspense fallback={<Spinner />}>
              <Outlet context={{ files, parent, refetch }} />
            </Suspense>
          </OutletContainer>
        </Container>
      </ErrorBoundary>
    )
  }),
)
