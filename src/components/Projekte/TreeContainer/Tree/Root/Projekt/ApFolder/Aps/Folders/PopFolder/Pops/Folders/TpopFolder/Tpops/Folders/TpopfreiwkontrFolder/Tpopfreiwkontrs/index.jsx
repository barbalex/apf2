import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ZaehlFolder } from './Zaehl/index.jsx'
import { useTpopfreiwkontrsNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfreiwkontrsNavData.js'
import { Tpopfreiwkontr } from './Tpopfreiwkontr.jsx'

export const Tpopfreiwkontrs = memo(
  observer(({ projekt, ap, pop, tpop }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfreiwkontrsNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
    })

    return navData.menus.map((menu) => (
      <Tpopfreiwkontr
        key={menu.id}
        {...{ menu, projekt, ap, pop, tpop }}
      />
    ))
  }),
)
