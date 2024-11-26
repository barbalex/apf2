import { memo } from 'react'
import { useParams } from 'react-router'

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
