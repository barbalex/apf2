import { List as SharedList } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useProjektNavData } from '../../../../modules/useProjektNavData.js'

export const List = () => {
  const { navData, isLoading, error } = useProjektNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return <SharedList navData={navData} />
}
