import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { useApNavData } from '../../../../modules/useApNavData.js'

export const List = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useApNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <SharedList
        items={navData.menus}
        title={navData.label}
        menuBar={<Menu isList={true} />}
        highlightSearchString={nodeLabelFilter.ap}
      />
    )
  }),
)
