import { memo } from 'react'
import { useParams } from 'react-router-dom'

import { FilesRouter } from '../../../shared/Files/index.jsx'

export const Component = memo(() => {
  const { tpopkontrId } = useParams()

  return (
    <FilesRouter
      parentId={tpopkontrId}
      parent="tpopkontr"
    />
  )
})
