import { memo } from 'react'
import { useParams } from 'react-router'

import { FilesRouter } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { tpopId } = useParams()

  return (
    <FilesRouter
      parentId={tpopId}
      parent="tpop"
    />
  )
})
