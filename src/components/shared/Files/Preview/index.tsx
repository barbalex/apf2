import { lazy, Suspense } from 'react'
import { useOutletContext, useParams } from 'react-router'
import { useResizeDetector } from 'react-resize-detector'

import { SuspenseImage } from '../../SuspenseImage.tsx'
import './style.css'

const DocViewerWrapper = lazy(() =>
  import('./DocViewerWrapper.tsx').then((m) => ({ default: m.DocViewerWrapper })),
)
import styles from './index.module.css'

const imageStyle = {
  objectFit: 'contain',
  margin: 'auto',
}

export const Component = () => {
  const { files } = useOutletContext()
  const { fileId } = useParams()
  const row = files?.find((file) => file.fileId === fileId) ?? {}

  const { width, height, ref } = useResizeDetector({
    // handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
  })

  const isImage = row.fileMimeType?.includes?.('image')
  const isPdf = row.fileMimeType?.includes?.('pdf')
  const isReactDocViewable =
    !isImage &&
    !isPdf &&
    row.fileMimeType &&
    [
      'text/csv',
      'application/vnd.oasis.opendocument.text',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/htm',
      'text/html',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'video/mp4',
    ].includes(row.fileMimeType)
  const isNotViewable = !isImage && !isPdf && !isReactDocViewable

  return (
    <div
      className={styles.fileClass}
      ref={ref}
    >
      {isImage && width && (
        <SuspenseImage
          src={`https://ucarecdn.com/${row.fileId}/-/preview/${Math.floor(width - 10)}x${Math.floor(
            height - 10,
          )}/-/format/auto/-/quality/smart/`}
          alt={row.name}
          width={width - 10}
          height={height - 10}
          style={imageStyle}
          fallback={
            <div
              style={{
                width: width - 10,
                height: height - 10,
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Loading...
            </div>
          }
        />
      )}
      {isPdf && (
        <object
          data={`https://ucarecdn.com/${row.fileId}/${row.name}`}
          type="application/pdf"
          style={{
            width,
            height: '100%',
          }}
        />
      )}
      {isReactDocViewable && (
        <div style={{ height: '100%' }}>
          <Suspense fallback={null}>
            <DocViewerWrapper
              fileId={row.fileId}
              name={row.name}
              fileMimeType={row.fileMimeType}
              width={width}
            />
          </Suspense>
        </div>
      )}
      {isNotViewable && (
        <div
          className={styles.text}
        >{`Sorry, für Dateien vom Typ '${row.fileMimeType}' gibt es keine Vorschau.`}</div>
      )}
    </div>
  )
}
