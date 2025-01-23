import { memo } from 'react'
import MenuItem from '@mui/material/MenuItem'

export const Option = memo(({option}) => {
  return (
    <MenuItem
      onClick={() => {}}
      dense
    >
      {option.label}
    </MenuItem>
  )
})
