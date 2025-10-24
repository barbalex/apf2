import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useRootNavData } from '../../../../modules/useRootNavData.js'

export const Component = () => {
  const { navData, isLoading, error } = useRootNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return <List navData={navData} />
}
