import Menu from '@mui/material/Menu'

import { Ekf } from './Ekf.tsx'
import type { MenuTpopNode, MenuTpopkontrNode } from '../types.ts'

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'top',
} as const

export const EkfsMenu = ({
  tpop,
  ekfs,
  ekfsAnchor,
  closeEkfsMenu,
}: {
  tpop: MenuTpopNode | undefined
  ekfs: MenuTpopkontrNode[]
  ekfsAnchor: HTMLElement | null
  closeEkfsMenu: () => void
}) => (
  <Menu
    anchorEl={ekfsAnchor}
    open={Boolean(ekfsAnchor)}
    onClose={closeEkfsMenu}
    anchorOrigin={anchorOrigin}
  >
    {ekfs.map((ekf, i: number) => (
      <Ekf
        key={ekf.id}
        tpop={tpop}
        ekf={ekf}
        border={i + 1 < ekfs.length}
      />
    ))}
  </Menu>
)
