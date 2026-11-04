import { useOutletContext } from 'react-router'

import { List } from './List.tsx'
import type { FilesOutletContext } from '../types.ts'

export const Component = () => {
  const { parent, files, refetch } = useOutletContext<FilesOutletContext>()

  return <List
    files={files}
    parent={parent}
    refetch={refetch}
  />
}
