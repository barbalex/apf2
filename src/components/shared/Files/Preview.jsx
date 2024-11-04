import { memo } from 'react'
import { useOutletContext } from 'react-router-dom'

export const Component = memo(() => {
  const { parentId, parent, files } = useOutletContext()
  console.log('Files', { parentId, parent, files })

  return <div>Preview</div>
})
