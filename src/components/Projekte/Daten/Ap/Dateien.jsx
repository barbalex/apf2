import { memo } from 'react'
import { useParams } from 'react-router-dom'

import { FilesRouter } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { apId } = useParams()

  return (
    <FilesRouter
      parentId={apId}
      parent="ap"
    />
  )
})
