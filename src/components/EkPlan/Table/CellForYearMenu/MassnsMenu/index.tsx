import Menu from '@mui/material/Menu'

import { Massn } from './Massn.tsx'
import type { MenuTpopNode, MenuTpopmassnNode } from '../types.ts'

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'top',
} as const

export const MassnsMenu = ({
  tpop,
  massns,
  massnsAnchor,
  closeMassnsMenu,
}: {
  tpop: MenuTpopNode | undefined
  massns: MenuTpopmassnNode[]
  massnsAnchor: HTMLElement | null
  closeMassnsMenu: () => void
}) => {
  return (
    <Menu
      anchorEl={massnsAnchor}
      open={Boolean(massnsAnchor)}
      onClose={closeMassnsMenu}
      anchorOrigin={anchorOrigin}
    >
      {massns.map((massn, i) => (
        <Massn
          key={massn.id}
          tpop={tpop}
          massn={massn}
          border={i + 1 < massns.length}
        />
      ))}
    </Menu>
  )
}
