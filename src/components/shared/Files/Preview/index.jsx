import { memo, useRef } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import styled from '@emotion/styled'

import '@cyntler/react-doc-viewer/dist/index.css'
import './style.css'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`
const FileDiv = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
`
const Image = styled.img`
  object-fit: contain;
`
const TextDiv = styled.div`
  align-self: center;
  padding-top: 2em;
`

export const Component = memo(() => {
  // containerRef is will be passed to the FullscreenControl
  const { parentId, parent, files, containerRef } = useOutletContext()
  const { fileId } = useParams()
  const previewRef = useRef(null)

  const row = files?.find((file) => file.fileId === fileId) ?? {}
  console.log('Files', { parentId, parent, files, row, containerRef })

  const { width, height, ref } = useResizeDetector({
    // handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
  })

  const isImage = row.fileMimeType.includes('image')
  const isPdf = row.fileMimeType.includes('pdf')
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

  console.log('Files', {
    isImage,
    isPdf,
    isReactDocViewable,
    isNotViewable,
    dataUrl: `https://ucarecdn.com/${row.fileId}`,
  })

  return (
    <FileDiv ref={ref}>
      {isImage && row.url && width && (
        <img
          src={`https://ucarecdn.com/${row.fileId}/-/preview/${Math.floor(width)}x${Math.floor(
            height,
          )}/-/format/auto/-/quality/smart/`}
          alt={row.name}
          width={width}
          height={
            row.width && row.height ?
              (width / row.width) * row.height
            : undefined
          }
          style={imageStyle}
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
          <DocViewer
            key={width}
            documents={[
              {
                uri: `https://ucarecdn.com/${row.fileId}/${row.name}`,
                mimeType: row.fileMimeType,
              },
            ]}
            renderers={DocViewerRenderers}
            config={{ header: { disableHeader: true } }}
            style={{ height: '100%' }}
            className="doc-viewer"
          />
        </div>
      )}
      {isNotViewable && (
        <TextDiv>{`Files with mime type '${row.fileMimeType}' can't be previewed (yet)`}</TextDiv>
      )}
    </FileDiv>
  )
})
