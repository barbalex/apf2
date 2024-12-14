import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { useBeobZugeordnetsNavData } from '../../../../modules/useBeobZugeordnetsNavData.js'
import { List as SharedList } from '../../../shared/List/index.jsx'
import { Menu } from '../BeobNichtBeurteilts/Menu.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const List = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading, error } = useBeobZugeordnetsNavData()

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <SharedList
        items={navData.menus}
        title={navData.label}
        menuBar={<Menu apfloraLayer="beobZugeordnet" />}
        highlightSearchString={nodeLabelFilter.beob}
      />
    )
  }),
)
