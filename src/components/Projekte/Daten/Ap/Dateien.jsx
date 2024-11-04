import { memo } from 'react'
import { useParams } from 'react-router-dom'

import { FilesRouter } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { apId } = useParams()
  console.log('ApFiles', { apId })

  return (
    <FilesRouter
      parentId={apId}
      parent="ap"
    />
  )
})
