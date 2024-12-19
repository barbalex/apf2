import { memo } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdFilterAlt } from 'react-icons/md'

export const FilterButton = memo(({ toggleFilterInput }) => {
  return (
    <Tooltip title="Filtern">
      <IconButton
        aria-label="Filtern"
        onClick={toggleFilterInput}
      >
        <MdFilterAlt />
      </IconButton>
    </Tooltip>
  )
})
