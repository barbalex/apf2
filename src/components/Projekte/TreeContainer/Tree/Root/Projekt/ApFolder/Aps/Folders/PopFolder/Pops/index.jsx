import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { PopFolders } from './PopFolders/index.jsx'
import { usePopsNavData } from '../../../../../../../../../../../modules/usePopsNavData.js'
import { Pop } from './Pop.jsx'

export const Pops = memo(
  observer(({ projekt, ap, in: inProp }) => {
    const store = useContext(MobxContext)
    const { popGqlFilterForTree } = store.tree

    const { navData } = usePopsNavData({ projId: projekt.id, apId: ap.id })

    return navData.menus.map((menu) => (
      <Pop
        key={menu.id}
        projekt={projekt}
        ap={ap}
        menu={menu}
        inProp={inProp}
      />
    ))
  }),
)
