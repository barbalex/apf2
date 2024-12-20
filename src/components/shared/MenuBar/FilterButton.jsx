import { memo, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdFilterAlt } from 'react-icons/md'
import styled from '@emotion/styled'

const StyledButton = styled(IconButton)`
  color: white;
`

export const FilterButton = memo(({ toggleFilterInput }) => {
  const onClick = useCallback(() => {
    toggleFilterInput()
  }, [toggleFilterInput])

  return (
    <Tooltip title="Filtern">
      <StyledButton
        aria-label="Filtern"
        onClick={onClick}
      >
        <MdFilterAlt />
      </StyledButton>
    </Tooltip>
  )
})
