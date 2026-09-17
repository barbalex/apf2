import { Tooltip } from '@mui/material'

import { ErrorBoundary } from '../../ErrorBoundary.tsx'
import type { FileNode } from '../types.ts'
import styles from './Title.module.css'

const FileNameForTooltip = ({ file }: { file: FileNode }) => (
  <div>
    <div className={styles.content}>
      {file.name && (
        <>
          <div>Name:</div>
          <div>{file.name}</div>
        </>
      )}
      {file.fileMimeType && (
        <>
          <div>Typ:</div>
          <div>{file.fileMimeType}</div>
        </>
      )}
      {file.beschreibung && (
        <>
          <div>Beschreibung:</div>
          <div>{file.beschreibung}</div>
        </>
      )}
    </div>
  </div>
)

export interface FilesMenuTitleProps {
  file?: FileNode | undefined
  numbers?: string | number
  titleComponentWidth: number
}

export const Title = ({ file, numbers, titleComponentWidth }: FilesMenuTitleProps) => {
  if (!file && numbers === undefined) return null

  // fix width to prevent jumping
  // but remember to subtract padding
  const width = titleComponentWidth - 20

  return (
    <ErrorBoundary>
      <Tooltip title={file ? <FileNameForTooltip file={file} /> : null}>
        <h3
          style={{
            width,
            minWidth: width,
            maxWidth: width,
          }}
          className={styles.title}
        >
          {numbers}
        </h3>
      </Tooltip>
    </ErrorBoundary>
  )
}
