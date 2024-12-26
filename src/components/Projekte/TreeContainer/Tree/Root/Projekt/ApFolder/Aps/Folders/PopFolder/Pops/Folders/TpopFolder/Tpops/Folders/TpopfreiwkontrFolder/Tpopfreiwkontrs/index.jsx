import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ZaehlFolder } from './Folders/ZaehlFolder/index.jsx'
import { useTpopfreiwkontrsNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfreiwkontrsNavData.js'
import { Tpopfreiwkontr } from './Tpopfreiwkontr.jsx'

export const Tpopfreiwkontrs = memo(
  observer(({ projekt, ap, pop, tpop, in: inProp, menu }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfreiwkontrsNavData(menu.fetcherParams)

    return navData.menus.map((menu) => (
      <Tpopfreiwkontr
        key={menu.id}
        {...{ menu, projekt, ap, pop, tpop, inProp }}
      />
    ))
  }),
)
