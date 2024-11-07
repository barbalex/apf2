import { memo } from 'react'
import styled from '@emotion/styled'
import { useOutletContext } from 'react-router-dom'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'

import { File } from './File.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
  padding: 10px;
`

export const Component = memo(() => {
  const { parent, files, refetch } = useOutletContext()

  return (
    <ErrorBoundary>
      <Container>
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
  )
})
