import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import { File } from './File.tsx'
import type { FileNode, FileParent } from '../types.ts'

import styles from './index.module.css'

export interface ListProps {
  files: FileNode[]
  parent: FileParent
  refetch: () => void
}

/** the file cards, used both by the route (via outlet context) and embedded */
export const List = ({ files, parent, refetch }: ListProps) => (
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
