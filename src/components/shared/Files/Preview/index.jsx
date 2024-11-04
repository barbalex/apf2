import { memo, useRef } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import styled from 'styled-components'

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
  const { parentId, parent, files } = useOutletContext()
  console.log('Files', { parentId, parent, files })
  const { fileId } = useParams()
  const previewRef = useRef(null)

  return <div>Preview</div>
})
