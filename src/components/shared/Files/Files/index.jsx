import styled from '@emotion/styled'
import { useOutletContext } from 'react-router'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'

import { File } from './File.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => (props.showfilter ? '#ffd3a7' : 'unset')};
  padding: 10px;
  overflow-y: auto;
  scrollbar-width: thin;
`

export const Component = () => {
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
}
