import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { usePopbersNavData } from '../../../../modules/usePopbersNavData.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(
  observer(() => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = usePopbersNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={navData.menus}
        title={navData.label}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.popber}
      />
    )
  }),
)
