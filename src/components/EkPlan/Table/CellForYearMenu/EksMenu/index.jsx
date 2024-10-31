import Menu from '@mui/material/Menu'

import { Eks } from './Eks.jsx'

const anchorOrigin = { horizontal: 'right', vertical: 'top' }

export const EksMenu = ({ tpop, eks, eksAnchor, closeEksMenu }) => (
  <Menu
    anchorEl={eksAnchor}
    open={Boolean(eksAnchor)}
    onClose={closeEksMenu}
    anchorOrigin={anchorOrigin}
  >
    {eks.map((ek, i) => (
      <Eks
        key={ek.id}
        tpop={tpop}
        ek={ek}
        border={i + 1 < eks.length}
      />
    ))}
  </Menu>
)
