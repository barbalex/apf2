import { memo } from 'react'

import { Zielber } from './Zielber.jsx'

export const Zielbers = memo(({ menus, in: inProp, parentTransitionState }) =>
  menus.map((menu) => (
    <Zielber
      key={menu.id}
      menu={menu}
      inProp={inProp}
      parentTransitionState={parentTransitionState}
    />
  )),
)
