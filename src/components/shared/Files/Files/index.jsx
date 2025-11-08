import { useOutletContext } from 'react-router'

import { ErrorBoundary } from '../../ErrorBoundary.jsx'
import { File } from './File.jsx'

import { container } from './index.module.css'

export const Component = () => {
  const { parent, files, refetch } = useOutletContext()

  return (
    <ErrorBoundary>
      <div className={container}>
        {files.map((file) => (
          <File
            key={file.fileId}
            file={file}
            parent={parent}
            refetch={refetch}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}
