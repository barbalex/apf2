import Menu from '@mui/material/Menu'

import { Eks } from './Eks.tsx'
import type { MenuTpopNode, MenuTpopkontrNode } from '../types.ts'

const anchorOrigin = {
  horizontal: 'right',
  vertical: 'top',
} as const

export const EksMenu = ({
  tpop,
  eks,
  eksAnchor,
  closeEksMenu,
}: {
  tpop: MenuTpopNode | undefined
  eks: MenuTpopkontrNode[]
  eksAnchor: HTMLElement | null
  closeEksMenu: () => void
}) => (
  <Menu
    anchorEl={eksAnchor}
    open={Boolean(eksAnchor)}
    onClose={closeEksMenu}
    anchorOrigin={anchorOrigin}
  >
    {eks.map((ek, i: number) => (
      <Eks
        key={ek.id}
        tpop={tpop}
        ek={ek}
        border={i + 1 < eks.length}
      />
    ))}
  </Menu>
)
