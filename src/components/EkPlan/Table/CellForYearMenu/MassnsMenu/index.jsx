import Menu from '@mui/material/Menu'

import { Massn } from './Massn.jsx'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

export const MassnsMenu = ({ tpop, massns, massnsAnchor, closeMassnsMenu }) => {
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
