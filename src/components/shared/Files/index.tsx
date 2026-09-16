import { useRef, useContext, Suspense } from 'react'
import { useSetAtom } from 'jotai'
import { gql as dynamicGql } from '../../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { upperFirst } from 'es-toolkit'
import { useNavigate, Outlet, useLocation } from 'react-router'

import { ErrorBoundary } from '../ErrorBoundary.tsx'
import { Error } from '../Error.tsx'
import { Spinner } from '../Spinner.tsx'
import {
  apFile as apFileFragment,
  idealbiotopFile as idealbiotopFileFragment,
  popFile as popFileFragment,
  tpopFile as tpopFileFragment,
  tpopkontrFile as tpopkontrFileFragment,
  tpopmassnFile as tpopmassnFileFragment,
} from '../fragments'
import { Uploader } from '../Uploader/index.tsx'
import { UploaderContext } from '../../../UploaderContext.ts'
import { Menu } from './Menu/index.tsx'
import type { FileNode, FileParent } from './types.ts'
import type {
  FileUploadSuccessEvent,
  FileUploadFailedEvent,
  CommonUploadSuccessEvent,
} from '../Uploader/index.tsx'

import './index.css'
import styles from './index.module.css'

import {
  addNotificationAtom,
} from '../../../store/index.ts'


type FilesQueryData = Record<string, { nodes: FileNode[] } | undefined>

const fragmentObject = {
  ap: apFileFragment,
  idealbiotop: idealbiotopFileFragment,
  pop: popFileFragment,
  tpop: tpopFileFragment,
  tpopkontr: tpopkontrFileFragment,
  tpopmassn: tpopmassnFileFragment,
}

export interface FilesRouterProps {
  parentId?: string | undefined
  parent: FileParent
}

export const FilesRouter = ({ parentId = '99999999-9999-9999-9999-999999999999', parent }: FilesRouterProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
    const { search } = useLocation()
    const navigate = useNavigate()

    const apolloClient = useApolloClient()

    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()
    const infoUuidsProcessed = useRef<string[]>([])

    const containerRef = useRef<HTMLDivElement>(null)

    const queryName = `all${upperFirst(parent)}Files`
    const parentIdName = `${parent}Id`
    const fields = `${upperFirst(parent)}FileFields`
    const fragment = fragmentObject[parent]

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const query = dynamicGql`
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
      queryFn: async () => {
        const result = await apolloClient.query({
          query,
          variables: { parentId },
        })
        return result.data as FilesQueryData
      },
    })

    const files = data?.[`all${upperFirst(parent)}Files`]?.nodes ?? []

    const onCommonUploadSuccess = (_info: CommonUploadSuccessEvent | null | undefined) => {
      // reset infoUuidsProcessed
      infoUuidsProcessed.current = []
      // close the uploader or it will be open when navigating to the list
      api?.doneFlow?.()
      // clear the uploader or it will show the last uploaded file when opened next time
      api?.removeAllFiles?.()
      // somehow this needs to be delayed or sometimes not all files will be uploaded
      setTimeout(() => void refetch(), 500)
    }

    // ISSUE: sometimes this is called multiple times with the same info.uuid
    const onFileUploadSuccess = async (
      info: FileUploadSuccessEvent | null | undefined,
    ) => {
      if (info) {
        if (infoUuidsProcessed.current.includes(info.uuid)) return
        infoUuidsProcessed.current.push(info.uuid)
        let responce:
          | { data?: Record<string, Record<string, FileNode> | undefined> }
          | undefined
        try {
          responce = (await apolloClient.mutate({
            mutation: dynamicGql`
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
          })) as { data?: Record<string, Record<string, FileNode> | undefined> }
        } catch (error) {
          console.log(error)
          addNotification({
            message: (error as Error).message,
            options: {
              variant: 'error',
            },
          })
        }
        // console.log('FilesRouter.onFileUploadSuccess', { info, responce })
        // navigate to the new file
        const newFile =
          responce?.data?.[`create${upperFirst(parent)}File`]?.[`${parent}File`]
        if (newFile) {
          void navigate(`${newFile.fileId}/Vorschau${search}`)
        }
      }
    }

    const onFileUploadFailed = (
      error: FileUploadFailedEvent | null | undefined,
    ) => {
      console.error('Upload failed:', error)
      addNotification({
        message:
        (error as { message?: string } | null | undefined)?.message ??
        'Upload fehlgeschlagen',
        options: {
          variant: 'error',
        },
      })
      // close the uploader or it will be open when navigating to the list
      api?.doneFlow?.()
      // clear the uploader or it will show the last uploaded file when opened next time
      api?.removeAllFiles?.()
      // somehow this needs to be delayed or sometimes not all files will be uploaded
      setTimeout(() => void refetch(), 500)
    }

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <div
          className={styles.container}
          ref={containerRef}
        >
          <Uploader
            onFileUploadSuccess={onFileUploadSuccess}
            onFileUploadFailed={onFileUploadFailed}
            onCommonUploadSuccess={onCommonUploadSuccess}
          />
          <Menu
            parent={parent}
            files={files}
            refetch={() => void refetch()}
            containerRef={containerRef}
          />
          <div className={styles.outletContainer}>
            <Suspense fallback={<Spinner />}>
              <Outlet context={{ files, parent, refetch: () => void refetch() }} />
            </Suspense>
          </div>
        </div>
      </ErrorBoundary>
    )
  }
