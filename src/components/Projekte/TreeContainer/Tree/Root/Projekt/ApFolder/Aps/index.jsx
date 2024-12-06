import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../storeContext.js'
import { ApFolders } from './Folders/index.jsx'
import { useApsNavData } from '../../../../../../../../modules/useApsNavData.js'
import { Ap } from './Ap.jsx'

export const Aps = memo(
  observer(({ projekt, in: inProp }) => {
    const store = useContext(StoreContext)
    const { openNodes } = store.tree

    const { navData } = useApsNavData({ projId: projekt.id })

    return navData?.menus.map((ap) => (
      <Ap
        key={ap.id}
        projekt={projekt}
        ap={ap}
        inProp={inProp}
      />
    ))
  }),
)
