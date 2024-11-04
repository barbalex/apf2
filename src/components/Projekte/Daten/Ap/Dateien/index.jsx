import { memo } from 'react'
import { useParams } from 'react-router-dom'

import { Files } from '../../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { apId } = useParams()

  return (
    <Files
      parentId={apId}
      parent="ap"
    />
  )
})
