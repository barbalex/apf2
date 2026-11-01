import { apiCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useMessagesNavData = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['treeMessages'],
    queryFn: async () => {
      const totalCount = await apiCount('/message')
      return { allMessages: { totalCount } }
    },
  })

  const count = data.allMessages?.totalCount

  const navData = {
    id: 'Mitteilungen',
    url: `/Daten/Mitteilungen`,
    label: `Mitteilungen (${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'messagesFolder',
    treeId: 'Mitteilungen',
    treeTableId: null,
    treeUrl: ['Mitteilungen'],
    fetcherName: 'useMessagesNavData',
    hasChildren: false,
  }

  return navData
}
