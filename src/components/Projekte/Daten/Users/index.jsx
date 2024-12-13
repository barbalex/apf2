import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MobxContext } from '../../../../mobxContext.js'
import { useUsersNavData } from '../../../../modules/useUsersNavData.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const Component = memo(
  observer(() => {
    const [isDesktopView] = useAtom(isDesktopViewAtom)
    
    const store = useContext(MobxContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useUsersNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={navData.menus}
        title={navData.label}
        menuBar={<Menu />}
        highlightSearchString={nodeLabelFilter.user}
      />
    )
  }),
)
