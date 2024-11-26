import { memo } from 'react'
import { useParams } from 'react-router'

import { FilesRouter } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { tpopmassnId } = useParams()

  return (
    <FilesRouter
      parentId={tpopmassnId}
      parent="tpopmassn"
    />
  )
})
