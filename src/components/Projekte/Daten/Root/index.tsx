import { List } from '../../../shared/List/index.tsx'
import { useRootNavData } from '../../../../modules/useRootNavData.ts'

export const Component = () => {
  const navData = useRootNavData()

  return <List navData={navData} />
}
