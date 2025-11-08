import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdFilterAlt } from 'react-icons/md'

import { button } from './FilterButton.module.css'

export const FilterButton = ({ toggleFilterInput }) => {
  const onClick = () => toggleFilterInput()

  return (
    <Tooltip title="Filtern">
      <IconButton
        aria-label="Filtern"
        onClick={onClick}
        className={button}
      >
        <MdFilterAlt />
      </IconButton>
    </Tooltip>
  )
}
