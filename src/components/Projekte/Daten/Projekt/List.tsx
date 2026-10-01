
import { List as SharedList } from '../../../shared/List/index.tsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.ts'

export const List = () => {
  const navData = useProjektNavData()

  return (
    <SharedList navData={navData} />
  )
}
