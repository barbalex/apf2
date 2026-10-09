
import { List as SharedList } from '../../../shared/List/index.tsx'
import { useWertesNavData } from '../../../../modules/useWertesNavData.ts'

export const List = () => {
  const navData = useWertesNavData()

  return (
    <SharedList navData={navData} />
  )
}
