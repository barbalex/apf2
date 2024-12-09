import { memo } from 'react'

import { Zielber } from './Zielber.jsx'

export const Zielbers = memo(
  ({ projekt, ap, jahr, ziel, menus, in: inProp, parentTransitionState }) =>
    menus.map((menu) => (
      <Zielber
        key={menu.id}
        projekt={projekt}
        ap={ap}
        jahr={jahr}
        ziel={ziel}
        menu={menu}
        inProp={inProp}
        parentTransitionState={parentTransitionState}
      />
    )),
)
