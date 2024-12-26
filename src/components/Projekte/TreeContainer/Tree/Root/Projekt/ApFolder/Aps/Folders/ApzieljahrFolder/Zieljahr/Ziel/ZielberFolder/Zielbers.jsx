import { memo } from 'react'

import { NodeTransitioned } from '../../../../../../../../../NodeTransitioned.jsx'

export const Zielbers = memo(({ menus, in: inProp, parentTransitionState }) =>
  menus.map((menu) => (
    <NodeTransitioned
      key={menu.id}
      menu={menu}
      in={inProp}
      parentTransitionState={parentTransitionState}
    />
  )),
)
