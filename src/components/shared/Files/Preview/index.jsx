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
  height: 100%;
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
const imageStyle = {
  objectFit: 'contain',
  margin: 'auto',
}

export const Component = memo(() => {
  // containerRef is will be passed to the FullscreenControl
  const { parentId, parent, files, containerRef } = useOutletContext()
  const { fileId } = useParams()
  const previewRef = useRef(null)

  const row = files?.find((file) => file.fileId === fileId) ?? {}

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

  return (
    <FileDiv ref={ref}>
      {isImage && width && (
        <img
          src={`https://ucarecdn.com/${row.fileId}/-/preview/${Math.floor(width - 10)}x${Math.floor(
            height - 10,
          )}/-/format/auto/-/quality/smart/`}
          alt={row.name}
          width={width - 10}
          height={height - 10}
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
        <TextDiv>{`Sorry, für Dateien vom Typ '${row.fileMimeType}' gibt es keine Vorschau.`}</TextDiv>
      )}
    </FileDiv>
  )
})
