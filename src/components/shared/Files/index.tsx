import { useRef, useContext, Suspense } from 'react'
import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Outlet, useLocation } from 'react-router'

import { ErrorBoundary } from '../ErrorBoundary.tsx'
import { Error } from '../Error.tsx'
import { Spinner } from '../Spinner.tsx'
import { apiFetch, apiInsert } from '../../../modules/api.ts'
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


export interface FilesRouterProps {
  parentId?: string | undefined
  parent: FileParent
}

export const FilesRouter = ({ parentId = '99999999-9999-9999-9999-999999999999', parent }: FilesRouterProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
    const { search } = useLocation()
    const navigate = useNavigate()

    const uploaderCtx = useContext(UploaderContext)
    const api = uploaderCtx?.current?.getAPI?.()
    const infoUuidsProcessed = useRef<string[]>([])

    const containerRef = useRef<HTMLDivElement>(null)

    // select aliases produce the camelCase FileNode shape the consumers expect
    const select = 'id,fileId:file_id,fileMimeType:file_mime_type,name,beschreibung'
    const { data, error, isLoading, refetch } = useQuery({
      queryKey: ['FileQuery', parent, parentId],
      queryFn: async () =>
        (await apiFetch<FileNode[]>(
          `/${parent}_file?${parent}_id=eq.${parentId}&select=${select}&order=name.asc`,
        )) ?? [],
    })

    const files = data ?? []

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
        try {
          await apiInsert(`${parent}_file`, {
            [`${parent}_id`]: parentId,
            file_id: info.uuid,
            file_mime_type: info.mimeType,
            name: info.name,
            beschreibung: null,
          })
        } catch (error) {
          console.log(error)
          addNotification({
            message: (error as Error).message,
            options: {
              variant: 'error',
            },
          })
        }
        // navigate to the new file
        void navigate(`${info.uuid}/Vorschau${search}`)
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
