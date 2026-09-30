
import { List as SharedList } from '../../../shared/List/index.tsx'
import { useIdealbiotopNavData } from '../../../../modules/useIdealbiotopNavData.ts'

export const List = () => {
  const navData = useIdealbiotopNavData()

  return (
    <SharedList navData={navData} />
  )
}
