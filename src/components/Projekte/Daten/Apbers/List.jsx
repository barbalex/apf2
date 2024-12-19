import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useAtom } from 'jotai'

import { MobxContext } from '../../../../mobxContext.js'
import { useApbersNavData } from '../../../../modules/useApbersNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'

export const List = memo(
  observer(() => {
    const [isDesktopView] = useAtom(isDesktopViewAtom)

    const store = useContext(MobxContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useApbersNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <SharedList
        items={navData.menus}
        title={navData.label}
        MenuBarComponent={Menu}
        highlightSearchString={nodeLabelFilter.apber}
      />
    )
  }),
)
