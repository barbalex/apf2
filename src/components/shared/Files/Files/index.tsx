import { useOutletContext } from 'react-router'

import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import { File } from './File.tsx'

import styles from './index.module.css'

export const Component = () => {
  const { parent, files, refetch } = useOutletContext()

  return (
    <ErrorBoundary>
      <div className={styles.container}>
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
