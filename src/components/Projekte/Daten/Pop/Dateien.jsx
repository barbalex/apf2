import { memo } from 'react'
import { useParams } from 'react-router-dom'

import { Files } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { popId } = useParams()

  return (
    <Files
      parentId={popId}
      parent="pop"
    />
  )
})
