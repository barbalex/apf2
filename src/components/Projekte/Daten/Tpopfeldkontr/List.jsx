import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useTpopfeldkontrNavData } from '../../../../modules/useTpopfeldkontrNavData.js'

export const List = () => {
  const { navData, isLoading, error } = useTpopfeldkontrNavData()

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <SharedList
      navData={navData}
      MenuBarComponent={Menu}
      menuBarProps={{ row: navData }}
    />
  )
}
